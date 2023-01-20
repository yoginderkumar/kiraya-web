import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
  AuthErrorCodes,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { $Values } from 'utility-types';
import { useCheckUserExistence } from '@kiraya/data-store/users';
import { useAuth } from 'reactfire';

export function resolveAuthErrors(e: unknown) {
  const error = e as AuthError;
  const errorCode = error.code as $Values<typeof AuthErrorCodes>;
  switch (errorCode) {
    case AuthErrorCodes.INVALID_PHONE_NUMBER:
    case AuthErrorCodes.MISSING_PHONE_NUMBER:
      return new Error('Please provide a valid phone number');
    case AuthErrorCodes.EMAIL_EXISTS:
      return new Error(
        'This email is already registered. Please login instead of signing up.'
      );
    case 'auth/user-not-found':
      return new Error(`This email is not registered with Kiraya!`);
    case 'auth/wrong-password':
      return new Error('Wrong password entered. Please enter a correct one!');
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return new Error('Network Error. Please try after some time');
    case AuthErrorCodes.POPUP_CLOSED_BY_USER:
      return new Error('Please select a google account to proceed.');
    default:
      if (errorCode) {
        return new Error(
          `[${errorCode}]: Can not verify. Please try after some time`
        );
      }
      return new Error(error.message);
  }
}

const authProvider = new GoogleAuthProvider();
export function useLoginUser() {
  const auth = getAuth();
  const { checkIfUserExists } = useCheckUserExistence();
  async function loginUsingGoogle() {
    try {
      const { user } = await signInWithPopup(auth, authProvider);
      const userExist = await checkIfUserExists(user.uid);
      return userExist;
    } catch (e) {
      throw resolveAuthErrors(e);
    }
  }
  async function loginUsingEmailPassword(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userExist = await checkIfUserExists(user.uid);
      return userExist;
    } catch (e) {
      throw resolveAuthErrors(e);
    }
  }

  async function registerAndLoginUserWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userExist = await checkIfUserExists(user.uid);
      return userExist;
    } catch (e) {
      throw resolveAuthErrors(e);
    }
  }

  async function sendResetPasswordLink(email: string) {
    const data = await sendPasswordResetEmail(auth, email);
    return data;
  }

  return {
    loginUsingGoogle,
    sendResetPasswordLink,
    loginUsingEmailPassword,
    registerAndLoginUserWithEmailAndPassword,
  };
}

export function useLogout() {
  const auth = useAuth();

  return async function logout() {
    await auth.signOut();
  };
}
