import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { getCurrentPlan } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import InitialsAvatar from '@/components/common/InitialsAvatar';
import { withBasePath } from '@/utils/withBasePath';

const LandingNavbar = () => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const firstName = useMemo(() => {
    if (!user?.first_name) return '';
    return user.first_name;
  }, [user]);

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    window.location.reload();
  };

  const handleProfile = () => {
    closeProfileMenu();
    closeMobileNav();
    router.push('/profile');
  };

  const handlePaidNavigation = async () => {
    closeMobileNav();

    if (!token) {
      router.push('/plans');
      return;
    }

    try {
      const response = await getCurrentPlan(token);
      if (response.hasAnyPlan) {
        router.push('/builder-paid');
        return;
      }
    } catch (_error) {
    }

    router.push('/plans');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 backdrop-blur-xl bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 md:h-16 md:py-0 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src={withBasePath('/hero.jpg')} alt="Riseflake" width={42} height={42} />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Riseflake
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          <Link
            href="https://riseflake.com/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Find Jobs
          </Link>
          <Link
            href="https://riseflake.com/companies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Companies
          </Link>
          <Link
            href="/ats-checker"
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            ATS Checker
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {!user && (
            <div className="flex items-center space-x-2">
              <Link href="/plans?auth=login">
                <Button
                  variant="text"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </Button>
              </Link>
              <Link href="/plans?auth=register">
                <Button
                  variant="outlined"
                  className="border-gray-300 text-gray-700 hover:border-indigo-600 px-5"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
          {user && (
            <>
              <button
                type="button"
                onClick={openProfileMenu}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <InitialsAvatar name={user.full_name} seed={user.id} size={34} />
                <span className="text-sm font-semibold text-slate-700">{firstName}</span>
              </button>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={closeProfileMenu}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
          <Button
            variant="contained"
            onClick={handlePaidNavigation}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl"
          >
            Build Now
          </Button>
          <Link href="/builder-trial">
            <Button
              variant="outlined"
              className="border-gray-300 text-gray-700 hover:border-indigo-600"
            >
              Trial
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMobileNav}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 pb-4 pt-3 space-y-3 bg-white">
          <div className="flex flex-col gap-2">
            <Link
              href="https://riseflake.com/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 font-medium transition px-1 py-1"
              onClick={closeMobileNav}
            >
              Find Jobs
            </Link>
            <Link
              href="https://riseflake.com/companies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 font-medium transition px-1 py-1"
              onClick={closeMobileNav}
            >
              Companies
            </Link>
            <Link
              href="/builder-free"
              className="text-gray-700 hover:text-indigo-600 font-medium transition px-1 py-1"
              onClick={closeMobileNav}
            >
              Resume Builder
            </Link>
            <Link
              href="/ats-checker"
              className="text-gray-700 hover:text-indigo-600 font-medium transition px-1 py-1"
              onClick={closeMobileNav}
            >
              ATS Checker
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {!user && (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/plans?auth=login" onClick={closeMobileNav}>
                  <Button
                    variant="outlined"
                    fullWidth
                    className="border-gray-300 text-gray-700 hover:border-indigo-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/plans?auth=register" onClick={closeMobileNav}>
                  <Button
                    variant="contained"
                    fullWidth
                    className="bg-slate-800 text-white hover:bg-slate-900"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {user ? (
              <button
                type="button"
                onClick={openProfileMenu}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <InitialsAvatar name={user.full_name} seed={user.id} size={32} />
                  <span className="text-sm font-semibold text-slate-700 truncate">{firstName}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            ) : null}

            <Button
              variant="contained"
              fullWidth
              onClick={handlePaidNavigation}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl"
            >
              Build Now
            </Button>
            <Link href="/builder-trial" onClick={closeMobileNav}>
              <Button
                variant="outlined"
                fullWidth
                className="border-gray-300 text-gray-700 hover:border-indigo-600"
              >
                Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
