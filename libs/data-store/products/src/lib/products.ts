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
  deleteDoc,
  DocumentReference,
  writeBatch,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useDatabase,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
  useUser,
} from 'reactfire';
import { TUser, useProfile } from '@kiraya/data-store/users';
import { Optional } from 'utility-types';
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
  address?: {
    state: ProductCategory;
    pinCode: string;
  };
  ownerInfo: Optional<TUser>;
  isFeatured?: boolean;
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
  const [progress, setProgress] = useState<number>(0);

  const storage = useStorage();
  const { user: authUser } = useProfile();
  const productRef = useProductsCollection();
  const batch = writeBatch(useFirestore());
  const { create: createVerification } = useCreateVerificationRequest();

  async function uploadImages(files: File[], productId: string) {
    try {
      const promises: unknown[] = [];
      files.forEach((file) => {
        const productsStorageRef = ref(
          storage,
          `Products/${authUser.uid}/${productId}/${uuidv4()}`
        );
        promises.push(
          uploadBytes(productsStorageRef, file).then((uploadResult) => {
            setProgress((prevValue) => prevValue + 5);
            return getDownloadURL(uploadResult.ref);
          })
        );
      });

      const photos: string[] = (await Promise.all(promises)) as string[];
      return photos;
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }

  const create = useCallback(
    async ({
      files,
      ...data
    }: {
      title: string;
      description?: string;
      tags?: string[];
      files: File[];
      category: ProductCategory;
      duration: number[];
      address: {
        state: ProductCategory;
        pinCode: string;
      };
      pricePerMonth: number;
    }) => {
      try {
        const userObj: Optional<TUser> = {
          displayName: authUser.displayName || undefined,
          photoURL: authUser.photoURL,
          metadata: authUser.metadata,
          email: authUser.email,
          phoneNumber: authUser.phoneNumber,
        };
        if (authUser.ratings) {
          userObj['ratings'] = authUser.ratings;
        }
        const payload = {
          ...data,
          ownerId: authUser.uid,
          viewCount: 0,
          tags: data.tags?.length ? data.tags : [''],
          availability: true,
          isUnderReview: true,
          creationAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerInfo: {
            ...userObj,
          },
        };
        const docRef = await addDoc(productRef, {} as Product);
        setProgress((prevValue) => prevValue + 10);
        batch.set(docRef, { uid: docRef.id, ...payload });
        setProgress((prevValue) => prevValue + 5);
        await createVerification(docRef.id);
        setProgress((prevValue) => prevValue + 5);
        const images = await uploadImages(files, docRef.id);
        // Update the DOC
        batch.update(docRef, { productMedia: images });
        setProgress((prevValue) => prevValue + 5);
        await batch.commit();
      } catch (e) {
        const err = e as Error;
        throw new Error(err.message);
      }
    },
    []
  );
  return {
    progress,
    create,
  };
}

export function useUpdateProduct(productId: string) {
  const productRef = useProductDocument(productId);
  async function updateProductData(data: Optional<Product>) {
    try {
      await updateDoc(productRef, {
        ...data,
        isUnderReview: true,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

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
    updateProductData,
    updateProductMedia,
  };
}

type MultipleImagesResponse = {
  message: string;
  urls: string[];
};

export function useProductImages(userId: string) {
  const storage = useStorage();
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  async function addProductImage(file: File, productId: string) {
    const productsStorageRef = ref(
      storage,
      `Products/${userId}/${productId}/${uuidv4()}`
    );
    const uploadTask = uploadBytes(productsStorageRef, file);
    const url = await uploadTask
      .then(async (uploaded) => {
        const url = await getDownloadURL(uploaded.ref);
        return url;
      })
      .catch((err) => console.log('err: ', err));
    return {
      url,
    };
  }

  async function addProductImages(files: File[], productId: string) {
    try {
      const promises = [];
      const uploadTasks = files.map((file) => {
        const productsStorageRef = ref(
          storage,
          `Products/${userId}/${productId}/${uuidv4()}`
        );
        const promiseForImage = uploadBytesResumable(productsStorageRef, file);
        promises.push(promiseForImage);
        promiseForImage.on(
          'state_changed',
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(prog);
          },
          (error) => {
            const err = error as Error;
            throw new Error(err.message);
          },
          async () => {
            await getDownloadURL(promiseForImage.snapshot.ref).then((url) => {
              setMediaUrls((prevUrls) => [...prevUrls, url]);
            });
          }
        );
      });
      // let updatedImages: MultipleImagesResponse = {} as MultipleImagesResponse;
      Promise.all(uploadTasks);
      return {
        urls: mediaUrls,
        progress: uploadProgress,
      };
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

  return {
    addProductImage,
    addProductImages,
  };
}

export function useDeleteProduct(productId: string) {
  const productRef = useProductDocument(productId);
  return useCallback(async () => {
    try {
      await deleteDoc(productRef);
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }, []);
}

export function useProductsForHomeUsers() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const productsCollection = useProductsCollection();
  const { data: user } = useUser();
  const productsQuery = query(
    productsCollection,
    where('ownerId', '!=', user?.uid || '')
    // orderBy('creationAt', 'desc')
  );
  const { data: products } = useFirestoreCollectionData(productsQuery, {
    idField: 'id',
  });
  const popularProducts = useMemo(() => {
    return products.sort((productA, productB) => {
      return (productA?.viewCount || 0) > (productB?.viewCount || 0) ? -1 : 1;
    });
  }, []);

  useEffect(() => {
    if (products.length) {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    isLoading,
    popularProducts,
  };
}
