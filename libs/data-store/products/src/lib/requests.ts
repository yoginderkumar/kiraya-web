import {
  addDoc,
  collection,
  CollectionReference,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';

export type RentRequest = {
  uid: string;
  status: 'pending' | 'approved' | 'rejected';
  productId: string;
  creationAt: string;
  updatedAt: string;
  raisedBy: {
    uid: string;
    name: string;
  };
  reasonsForRejection?: string[];
};

function useRentsRequestsCollection() {
  const store = useFirestore();
  return collection(store, 'Requests') as CollectionReference<RentRequest>;
}
export function useSendRentRequest() {
  const rentRequestsRef = useRentsRequestsCollection();
  return useCallback(async function sendRequest({
    productId,
    raisedBy,
  }: {
    productId: string;
    raisedBy: { uid: string; name: string };
  }) {
    try {
      const docRef = await addDoc(rentRequestsRef, {} as RentRequest);
      await setDoc(docRef, {
        uid: docRef.id,
        status: 'pending',
        productId: productId,
        creationAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        raisedBy: raisedBy,
      });
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  },
  []);
}
