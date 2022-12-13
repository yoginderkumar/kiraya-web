import {
  addDoc,
  collection,
  CollectionReference,
  // doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';

export type Verification = {
  uid: string;
  status: 'pending' | 'approved' | 'rejected';
  productId: string;
  creationAt: string;
  updatedAt: string;
  reasonsForRejection?: string[];
};

function useVerificationRequestsCollection() {
  const store = useFirestore();
  return collection(store, 'Verification') as CollectionReference<Verification>;
}

//   function useVerificationDocument(docId: string) {
//     const verificationCollection = useVerificationRequestsCollection();
//     return doc(verificationCollection, docId);
//   }

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
