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

function useVerificationRequestsForProductCollection() {
  const store = useFirestore();
  return collection(store, 'Verification');
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
