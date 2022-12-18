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
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
  useUser,
} from 'reactfire';
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

export function useCreateNewProduct() {
  //Hooks
  const storage = useStorage();
  const { data: authUser } = useUser();
  const productRef = useProductsCollection();
  const { create: createVerification } = useCreateVerificationRequest();

  //States
  const [status, setStatus] = useState<'init' | 'progress' | 'completed'>(
    'init'
  );
  const [isProductUploading, setIsProductUploading] = useState<boolean>(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [numOfMediaFiles, setNumOfMediaFiles] = useState<number>(0);
  const [productToBeUploaded, setProductToBeUploaded] = useState<{
    docRef: DocumentReference<Product>;
    title: string;
    description?: string;
    tags?: string[];
    category: ProductCategory;
    duration: number[];
    address: {
      state: ProductCategory;
      pinCode: string;
    };
    pricePerMonth: number;
  } | null>(null);
  const [progress, setProgress] = useState<{
    message: string;
    bytesTransferred: number;
    totalBytes: number;
  } | null>(null);
  useEffect(() => {
    if (progress !== null) {
      const calculatedProgress =
        (progress.bytesTransferred / progress.totalBytes) * 100;
      if (
        calculatedProgress === 100 &&
        !isProductUploading &&
        productToBeUploaded !== null &&
        mediaUrls.length === numOfMediaFiles
      ) {
        setIsProductUploading(true);
        createProduct(productToBeUploaded);
        return;
      }
    }
  }, [progress, mediaUrls]);

  async function createProduct({
    docRef,
    title,
    description,
    tags,
    address,
    category,
    duration,
    pricePerMonth,
  }: {
    docRef: DocumentReference<Product>;
    title: string;
    description?: string;
    tags?: string[];
    category: ProductCategory;
    duration: number[];
    address: {
      state: ProductCategory;
      pinCode: string;
    };
    pricePerMonth: number;
  }) {
    if (!authUser?.uid) {
      throw new Error('Please login to add product.');
    }
    try {
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
        address,
        productMedia: mediaUrls,
        isUnderReview: true,
        creationAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        pricePerMonth: pricePerMonth,
      });
      setStatus('completed');
      await createVerification(docRef.id);
      setTimeout(() => {
        setStatus('init');
        setIsProductUploading(false);
        setMediaUrls([]);
        setNumOfMediaFiles(0);
        setProductToBeUploaded(null);
        setProgress(null);
      }, 1000);
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }

  const createProductsWithImages = useCallback(
    async ({
      title,
      description,
      tags,
      files,
      address,
      category,
      duration,
      pricePerMonth,
    }: {
      title: string;
      description?: string;
      tags?: string[];
      category: ProductCategory;
      duration: number[];
      files: File[];
      address: {
        state: ProductCategory;
        pinCode: string;
      };
      pricePerMonth: number;
    }) => {
      if (!authUser?.uid) {
        throw new Error('Please login to add product.');
      }
      try {
        const docRef = await addDoc(productRef, {} as Product);
        setProductToBeUploaded({
          docRef,
          title,
          description,
          tags,
          address,
          category,
          duration,
          pricePerMonth,
        });
        setNumOfMediaFiles(files.length);
        const promises = [];
        const uploadTasks = files.map((file) => {
          const productsStorageRef = ref(
            storage,
            `Products/${authUser.uid}/${docRef.id}/${uuidv4()}`
          );
          const promiseForImage = uploadBytesResumable(
            productsStorageRef,
            file
          );
          promises.push(promiseForImage);
          promiseForImage.on(
            'state_changed',
            (snapshot) => {
              setProgress({
                message: 'Uploading image...',
                bytesTransferred:
                  (progress?.bytesTransferred || 0) + snapshot.bytesTransferred,
                totalBytes: (progress?.totalBytes || 0) + snapshot.totalBytes,
              });
            },
            (error) => {
              const err = error as Error;
              throw new Error(err.message);
            },
            async () => {
              await getDownloadURL(promiseForImage.snapshot.ref).then((url) => {
                setMediaUrls((prevUrls) => [...prevUrls, url]);
                console.log('progress: Check call', progress, mediaUrls);
              });
            }
          );
        });
        Promise.all(uploadTasks);
      } catch (e) {
        const err = e as Error;
        throw new Error(err.message);
      }
    },
    []
  );
  return {
    status,
    progress,
    productId: productToBeUploaded?.docRef.id,
    createProductsWithImages,
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
      console.log('Called?');
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    isLoading,
    popularProducts,
  };
}
