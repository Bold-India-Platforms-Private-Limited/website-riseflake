import { FormEvent, useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile, { TurnstileHandle } from '@/components/common/Turnstile';
import {
  APP_URL,
  ApiError,
  checkAccount,
  forgotPassword,
  googleLogin,
  loginAccount,
  registerAccount,
  sendEmailOtp,
  verifyEmailOtp,
} from '@/lib/authApi';
import { getGoogleIdToken, preloadGoogleSignIn } from '@/lib/googleSignIn';
import { useAuthStore } from '@/stores/auth.store';

export type AuthMode = 'login' | 'register' | 'otp' | 'forgot';

interface AuthSheetProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSignedIn: () => void;
}

const TITLES: Record<AuthMode, { title: string; note: string }> = {
  login: { title: 'Login with Riseflake', note: 'Use the account you use for jobs on Riseflake.' },
  register: { title: 'Create your Riseflake account', note: 'One account for jobs, your resume and your subscription.' },
  otp: { title: 'Verify your email', note: '' },
  forgot: { title: 'Reset your password', note: "We'll email you a link to set a new password." },
};

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-3 text-[15px] outline-none focus:border-[#2f5ee7] focus:ring-1 focus:ring-[#2f5ee7]';
const primaryClass =
  'w-full rounded-full bg-[#2f5ee7] py-3 text-[15px] font-semibold text-white hover:bg-[#2650cc] disabled:opacity-60 cursor-pointer disabled:cursor-default';
const linkClass = 'font-semibold text-[#2f5ee7] hover:underline cursor-pointer';
const googleClass =
  'flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-300 bg-white py-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 cursor-pointer disabled:cursor-default';

const GoogleLogo = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7.2-10.2 7.2-17.6z" />
    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

const AuthSheet = ({ mode, onModeChange, onClose, onSignedIn }: AuthSheetProps) => {
  const refresh = useAuthStore((state) => state.refresh);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const [captcha, setCaptcha] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);

  const [forgotEmail, setForgotEmail] = useState('');

  const mobileNo = mobile ? `+${mobile}` : '';

  // Someone who signs in on app.riseflake.com in another tab (LinkedIn and so on) is
  // signed in here too as soon as they come back, because the cookie is shared.
  useEffect(() => {
    const onFocus = async () => {
      await refresh();
      if (useAuthStore.getState().isAuthenticated) onSignedIn();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh, onSignedIn]);

  useEffect(() => {
    preloadGoogleSignIn().catch(() => {});
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const switchMode = (next: AuthMode) => {
    setError('');
    setNotice('');
    onModeChange(next);
  };

  const needCaptcha = () => {
    if (captcha) return false;
    setError('Please wait a moment while we check your browser, then try again.');
    return true;
  };

  const finishSignIn = async () => {
    await refresh();
    onSignedIn();
  };

  // The one place an existing account turns a registration into a login.
  const suggestLogin = (err: ApiError) => {
    setIdentifier(err.field === 'mobile' ? mobileNo : email.trim());
    setPassword('');
    setError('');
    setNotice(err.message);
    onModeChange('login');
  };

  const handleGoogle = async () => {
    setGoogleBusy(true);
    setError('');
    try {
      await googleLogin(await getGoogleIdToken());
      await finishSignIn();
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      if (code === 'auth/popup-blocked') setError('Your browser blocked the Google window. Allow pop-ups for this site and try again.');
      else if (err instanceof ApiError) setError(err.message);
      else setError('Google sign-in did not work here. Please login with your email, or reset your password.');
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (needCaptcha()) return;
    setBusy(true);
    setError('');
    try {
      await loginAccount({ identifier: identifier.trim(), password, cf_turnstile_token: captcha });
      await finishSignIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      turnstileRef.current?.reset();
    } finally {
      setBusy(false);
    }
  };

  const createAccount = async () => {
    try {
      await registerAccount({
        full_name: fullName.trim().replace(/\s+/g, ' '),
        email: email.trim().toLowerCase(),
        mobile_no: mobileNo,
        password,
        cf_turnstile_token: captcha,
      });
    } catch (err) {
      turnstileRef.current?.reset();
      throw err;
    }
    await finishSignIn();
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await checkAccount({ email: email.trim(), mobile_no: mobileNo });
      const sent = await sendEmailOtp(email.trim().toLowerCase());
      if (sent.otpDisabled) {
        await createAccount();
        return;
      }
      setResendIn(sent.resendAfter || 60);
      setOtp('');
      onModeChange('otp');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ACCOUNT_EXISTS') suggestLogin(err);
      else setError(err instanceof Error ? err.message : 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  };

  const handleOtp = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await verifyEmailOtp(email.trim().toLowerCase(), otp.trim());
      await createAccount();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ACCOUNT_EXISTS') suggestLogin(err);
      else setError(err instanceof Error ? err.message : 'Could not verify the code.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      const sent = await sendEmailOtp(email.trim().toLowerCase());
      setResendIn(sent.resendAfter || 60);
      toast.success('A new code is on its way.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send a new code.');
    }
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    if (needCaptcha()) return;
    setBusy(true);
    setError('');
    try {
      const response = await forgotPassword(forgotEmail.trim(), captcha);
      toast.success(response.message || 'Check your email for the reset link.');
      setIdentifier(forgotEmail.trim());
      switchMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset link.');
    } finally {
      turnstileRef.current?.reset();
      setBusy(false);
    }
  };

  const { title, note } = TITLES[mode];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={onClose} />
      <aside
        role="dialog"
        aria-label={title}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:w-[440px] sm:rounded-none sm:border-l sm:border-slate-200"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-slate-900">{title}</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {mode === 'otp' ? `We sent a 6 digit code to ${email.trim()}.` : note}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-8 pt-5">
          {notice && (
            <p className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-3.5 py-3 text-sm text-slate-800">{notice}</p>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="mb-4 space-y-4">
              <button type="button" onClick={handleGoogle} disabled={busy || googleBusy} className={googleClass}>
                <GoogleLogo />
                {googleBusy ? 'Opening Google...' : 'Continue with Google'}
              </button>
              <div className="flex items-center gap-3 text-[13px] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form className="space-y-3.5" onSubmit={handleLogin}>
              <input
                className={inputClass}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Email or mobile number"
                autoComplete="username"
                required
              />
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button type="submit" disabled={busy} className={primaryClass}>
                {busy ? 'Logging in...' : 'Login with Riseflake'}
              </button>
              <div className="flex justify-between pt-1 text-sm">
                <button type="button" className={linkClass} onClick={() => { setForgotEmail(identifier.includes('@') ? identifier : ''); switchMode('forgot'); }}>
                  Forgot password?
                </button>
                <button type="button" className={linkClass} onClick={() => switchMode('register')}>
                  Create account
                </button>
              </div>
              <p className="pt-2 text-[13px] leading-relaxed text-slate-500">
                Signed up with LinkedIn?{' '}
                <a href={`${APP_URL}/login`} target="_blank" rel="noreferrer" className={linkClass}>
                  Login on Riseflake
                </a>{' '}
                and come back to this tab.
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form className="space-y-3.5" onSubmit={handleRegister}>
              <input className={inputClass} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" autoComplete="name" required />
              <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" autoComplete="email" required />
              <PhoneInput
                country="in"
                value={mobile}
                onChange={(value: string) => setMobile(value)}
                inputProps={{ name: 'mobileNo', required: true }}
                containerStyle={{ width: '100%' }}
                inputStyle={{ width: '100%', height: '48px', borderRadius: '0.5rem', borderColor: '#cbd5e1', fontSize: '15px' }}
                buttonStyle={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', borderColor: '#cbd5e1' }}
                dropdownStyle={{ zIndex: 100 }}
              />
              <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (8 characters or more)" autoComplete="new-password" minLength={8} required />
              <button type="submit" disabled={busy} className={primaryClass}>
                {busy ? 'Please wait...' : 'Continue'}
              </button>
              <p className="pt-1 text-sm text-slate-600">
                Already on Riseflake?{' '}
                <button type="button" className={linkClass} onClick={() => switchMode('login')}>
                  Login
                </button>
              </p>
            </form>
          )}

          {mode === 'otp' && (
            <form className="space-y-3.5" onSubmit={handleOtp}>
              <input
                className={`${inputClass} text-center text-xl tracking-[0.3em]`}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                minLength={6}
              />
              <button type="submit" disabled={busy || otp.length < 6} className={primaryClass}>
                {busy ? 'Creating your account...' : 'Verify and create account'}
              </button>
              <div className="flex justify-between pt-1 text-sm">
                <button type="button" className={linkClass} onClick={() => switchMode('register')}>
                  Change details
                </button>
                {resendIn > 0 ? (
                  <span className="text-slate-500">Resend in {resendIn}s</span>
                ) : (
                  <button type="button" className={linkClass} onClick={handleResend}>
                    Resend code
                  </button>
                )}
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form className="space-y-3.5" onSubmit={handleForgot}>
              <input className={inputClass} type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="Your Riseflake email" autoComplete="email" required />
              <button type="submit" disabled={busy} className={primaryClass}>
                {busy ? 'Sending...' : 'Send reset link'}
              </button>
              <button type="button" className={`${linkClass} pt-1 text-sm`} onClick={() => switchMode('login')}>
                Back to login
              </button>
            </form>
          )}

          <div className="mt-3">
            <Turnstile ref={turnstileRef} onToken={setCaptcha} />
          </div>

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
        </div>
      </aside>
    </>
  );
};

export default AuthSheet;
