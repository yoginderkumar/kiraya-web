import {
  addDoc,
  collection,
  CollectionReference,
  where,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  query,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { useCallback } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire';

export type Verification = {
  uid: string;
  status: 'pending' | 'approved' | 'rejected';
  productId: string;
  creationAt: Timestamp;
  updatedAt: Timestamp;
  reasonsForRejection?: string[];
};

function useVerificationRequestsCollection() {
  const store = useFirestore();
  return collection(store, 'Verification') as CollectionReference<Verification>;
}

function useVerificationRequestsForProductCollection() {
  const store = useFirestore();
  return collection(store, 'Verification');
}

function useVerificationDocument(reqId: string) {
  const usersCollection = useVerificationRequestsCollection();
  return doc(usersCollection, reqId);
}

export function useCreateVerificationRequest() {
  const verificationRef = useVerificationRequestsCollection();
  async function create(productId: string) {
    try {
      const docRef = await addDoc(verificationRef, {} as Verification);
      await setDoc(docRef, {
        uid: docRef.id,
        status: 'pending',
        productId: productId,
        creationAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

  return {
    create,
  };
}

export function useUpdateVerificationRequestWithProduct() {
  const { create } = useCreateVerificationRequest();
  const verificationRef = useVerificationRequestsForProductCollection();
  async function update(productId: string) {
    const queryRef = query(
      verificationRef,
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(queryRef);
    if (!querySnapshot.docs.length) {
      await create(productId);
      return;
    }
    const docRef = doc(verificationRef, querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      status: 'pending',
      updatedAt: serverTimestamp(),
    });
  }
  return {
    update,
  };
}

export function useVerificationRequests() {
  const requestsCollection = useVerificationRequestsCollection();
  const requestsQuery = query(
    requestsCollection,
    orderBy('creationAt', 'desc')
  );
  const { data: requests } = useFirestoreCollectionData(requestsQuery, {
    idField: 'id',
  });

  return {
    requests,
  };
}

export function useVerificationRequestById(reqId: string) {
  const reqDoc = useVerificationDocument(reqId);
  const { data: request } = useFirestoreDocData(reqDoc, {
    idField: 'id',
  });
  return {
    request,
  };
}

export function useUpdateVerificationById(reqId: string) {
  const reqDoc = useVerificationDocument(reqId);
  const reject = useCallback(async (reasonsToReject: string[]) => {
    await updateDoc(reqDoc, {
      status: 'rejected',
      reasonsForRejection: reasonsToReject,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const approve = useCallback(async () => {
    await updateDoc(reqDoc, {
      status: 'approved',
      updatedAt: serverTimestamp(),
    });
  }, []);

  return {
    reject,
    approve,
  };
}
