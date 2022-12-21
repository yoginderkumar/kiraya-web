import { updateEmail, updateProfile } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect } from 'react';
import {
  useFirestore,
  useFirestoreDocData,
  useUser,
  useFunctions,
  useSigninCheck,
} from 'reactfire';
import { Optional } from 'utility-types';

export type TUser = {
  displayName?: string;
  email?: string | null;
  emailVerified?: boolean;
  isAnonymous: boolean;
  phoneNumber?: string | null;
  photoURL?: string | null;
  providerId: 'firebase';
  uid: string;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  ratings?: {
    totalRatings: number;
    numberOfReviews: number;
  };
};
function useUserCollection() {
  const store = useFirestore();
  return collection(store, 'Users') as CollectionReference<TUser>;
}

function useUserDocument(userId: string) {
  const usersCollection = useUserCollection();
  return doc(usersCollection, userId);
}

export function useCreateProfile() {
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || 'missing');
  return async function create(data: Optional<TUser>) {
    if (!authUser) throw new Error('Please login to create profile');
    if (authUser) {
      // update the auth profile
      updateProfile(authUser, {
        displayName: data.displayName,
      });
    }
    await setDoc(userDoc, {
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      isAnonymous: authUser.isAnonymous,
      metadata: {
        creationTime: authUser.metadata.creationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
      },
      phoneNumber: authUser.phoneNumber,
      photoURL: authUser.photoURL,
      providerId: 'firebase',
      uid: authUser.uid,
      ...data,
    });
  };
}

export function useCheckUserExistence() {
  const usersCollection = useUserCollection();
  async function checkIfUserExists(userId: string): Promise<TUser | undefined> {
    const userDocRef = doc(usersCollection, userId);
    const user = await (await getDoc(userDocRef)).data();
    return user;
  }

  return {
    checkIfUserExists,
  };
}

export function useUpdateProfile() {
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || 'missing');
  return useCallback(
    async function update(
      data: Omit<Optional<TUser>, 'fcmTokens'> & {
        fcmTokens?: Array<string>;
      }
    ) {
      if (!authUser) throw new Error('Please login to update profile');
      if (data.displayName) {
        // update the auth profile
        updateProfile(authUser, {
          displayName: data.displayName,
        });
      }
      await updateDoc(userDoc, data);
    },
    [userDoc, authUser]
  );
}

export function useProfile() {
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || 'missing');
  const { data: user } = useFirestoreDocData<TUser>(userDoc, {
    idField: 'uid',
  });
  const update = useUpdateProfile();
  return {
    user,
    update,
  };
}
