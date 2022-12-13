import { uuidv4 } from '@firebase/util';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRef } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
  useUser,
} from 'reactfire';
import { useCreateVerificationRequest } from './verification';

export type ProductCategory = {
  id: string;
  label: string;
};

export type Product = {
  uid: string;
  title: string;
  description?: string;
  ownerId: string;
  tags?: string[];
  category: ProductCategory;
  creationAt: string;
  updatedAt: string;
  viewCount?: number;
  duration: number[];
  availability?: boolean;
  age?: number;
  pricePerMonth: number;
  isUnderReview: boolean;
  productMedia?: string[];
};

function useProductsCollection() {
  const store = useFirestore();
  return collection(store, 'Products') as CollectionReference<Product>;
}

function useProductDocument(productId: string) {
  const usersCollection = useProductsCollection();
  return doc(usersCollection, productId);
}

export function useEnsuredProduct(productId: string) {
  const productDoc = useProductDocument(productId);
  const { data: productData } = useFirestoreDocData(productDoc, {
    idField: 'id',
  });
  // Create a ref of current data and pass it down.
  // This allows us to handle the book deletion
  const productRef = useRef(productData);
  let isDeleted = false;
  if (productData && productData.title) {
    // always keep the data in sync
    productRef.current = productData;
  } else {
    isDeleted = true;
  }
  if (!productRef.current) {
    throw new Error('Product not found');
  }
  return { product: productRef.current, isDeleted };
}

export function useProduct(productId: string) {
  const { product, isDeleted } = useEnsuredProduct(productId);
  return {
    product,
    isDeleted,
  };
}

export function useProductsForOwner() {
  const productsCollection = useProductsCollection();
  const { data: user } = useUser();
  console.log('UYser:', user?.uid);
  const productsQuery = query(
    productsCollection,
    where('ownerId', '==', user?.uid),
    orderBy('creationAt', 'desc')
  );
  const { data: products } = useFirestoreCollectionData(productsQuery, {
    idField: 'id',
  });

  return {
    products,
  };
}

export function useCreateProduct() {
  const { data: authUser } = useUser();
  const { create: createVerification } = useCreateVerificationRequest();
  const productRef = useProductsCollection();
  async function create({
    title,
    description,
    tags,
    category,
    duration,
    pricePerMonth,
  }: {
    title: string;
    description?: string;
    tags?: string[];
    category: ProductCategory;
    duration: number[];
    pricePerMonth: number;
  }) {
    if (!authUser?.uid) {
      throw new Error('Please login to add product.');
    }
    try {
      const docRef = await addDoc(productRef, {} as Product);
      await setDoc(docRef, {
        uid: docRef.id,
        title: title,
        ownerId: authUser.uid,
        duration: duration,
        category: category,
        viewCount: 0,
        tags: tags?.length ? tags : [''],
        availability: false,
        description,
        isUnderReview: true,
        creationAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        pricePerMonth: pricePerMonth,
      });
      await createVerification(docRef.id);
      return {
        productId: docRef.id,
      };
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

  return {
    create,
  };
}

export function useUpdateProduct(productId: string) {
  const productRef = useProductDocument(productId);
  async function updateProductMedia(images: string[]) {
    try {
      await updateDoc(productRef, {
        productMedia: images,
      });
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

  return {
    updateProductMedia,
  };
}

export function useProductImages(userId: string, productId: string) {
  const storage = useStorage();
  async function addProductImage(file: File) {
    const productsStorageRef = ref(
      storage,
      `Products/${userId}/${productId}/${uuidv4()}`
    );
    const uploadTask = uploadBytes(productsStorageRef, file);
    const url = await uploadTask
      .then(async (uploaded) => {
        console.log('Uploaded: ', uploaded);
        const url = await getDownloadURL(uploaded.ref);
        return url;
      })
      .catch((err) => console.log('err: ', err));
    return {
      url,
    };
  }

  return {
    addProductImage,
  };
}
