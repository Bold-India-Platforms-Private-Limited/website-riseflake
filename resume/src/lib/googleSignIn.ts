// Google sign-in on the resume site, through the same Firebase project as
// app.riseflake.com. Loaded when the sign-in panel opens so other pages stay light.
const loadFirebase = () => Promise.all([import('firebase/app'), import('firebase/auth')]);

let firebase: ReturnType<typeof loadFirebase> | null = null;

export const preloadGoogleSignIn = () => {
  firebase = firebase || loadFirebase().catch((err) => {
    firebase = null;
    throw err;
  });
  return firebase;
};

export const getGoogleIdToken = async () => {
  const [{ getApps, initializeApp }, { GoogleAuthProvider, getAuth, signInWithPopup }] = await preloadGoogleSignIn();
  const app = getApps()[0] || initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const { user } = await signInWithPopup(getAuth(app), provider);
  return user.getIdToken();
};
