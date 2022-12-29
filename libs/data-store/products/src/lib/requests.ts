import {
  addDoc,
  collection,
  CollectionReference,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';

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
      const queryRef = query(
        rentRequestsRef,
        where('productId', '==', productId),
        where(`raisedBy.uid`, '==', raisedBy.uid)
      );
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.docs.length) {
        throw new Error('You have already sent a request to the owner!');
      }
      if (!querySnapshot.docs.length) {
        const docRef = await addDoc(rentRequestsRef, {} as RentRequest);
        await setDoc(docRef, {
          uid: docRef.id,
          status: 'pending',
          productId: productId,
          creationAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          raisedBy: raisedBy,
        });
        return;
      }
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  },
  []);
}

export function useRequestsByYou() {
  const requestsCollection = useRentsRequestsCollection();
  const { data: user } = useUser();
  const requestsQuery = query(
    requestsCollection,
    where('raisedBy.uid', '==', user?.uid || ''),
    orderBy('creationAt', 'desc')
  );
  const { data: requests } = useFirestoreCollectionData(requestsQuery, {
    idField: 'id',
  });

  return {
    requests,
  };
}
