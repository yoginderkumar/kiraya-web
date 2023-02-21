import { uuidv4 } from '@firebase/util';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  deleteDoc,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
  useUser,
} from 'reactfire';
import { TUser, useProfile } from '@kiraya/data-store/users';
import { Optional } from 'utility-types';
import { useFormik } from 'formik';
import {
  useUpdateVerificationById,
  useCreateVerificationRequest,
  useUpdateVerificationRequestWithProduct,
} from './verification';

export type ProductCategory = {
  id: string;
  label: string;
};

export type Categories =
  | 'books'
  | 'musicalInstruments'
  | 'homeAppliances'
  | 'furniture'
  | 'decor'
  | 'storage';

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
  reviewStatus?: 'pending' | 'rejected' | 'approved';
  ownerInfo: Optional<TUser>;
  isFeatured?: boolean;
  rejectDetails?: string[];
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
  const productDoc = useProductDocument(productId);
  const { product, isDeleted } = useEnsuredProduct(productId);
  const incrementProductViewCount = useCallback(() => {
    updateDoc(productDoc, { viewCount: (product.viewCount || 0) + 1 });
  }, []);
  return {
    product,
    isDeleted,

    incrementProductViewCount,
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
  const firebaseApp = useFirestore();
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
        const batch = writeBatch(firebaseApp);
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
        console.log('ee: ', err);
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
    orderBy('creationAt', 'desc')
  );
  const { data: products } = useFirestoreCollectionData(productsQuery, {
    idField: 'id',
  });
  const popularProducts = useMemo(() => {
    return products
      .filter((product) => product.ownerId !== user?.uid)
      .sort((productA, productB) => {
        return (productA?.viewCount || 0) > (productB?.viewCount || 0) ? -1 : 1;
      })
      .slice(0, 6);
  }, [user?.uid]);

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

export function useProductsForCategories(categoryId: string) {
  const { products } = useProducts();
  const categorizedProducts = useMemo(() => {
    return products.filter((product) => product.category.id === categoryId);
  }, []);
  return {
    categorizedProducts,
  };
}

export function useUpdateProduct(productId: string) {
  const [progress, setProgress] = useState<number>(0);

  const storage = useStorage();
  const { product } = useProduct(productId);
  const { user: authUser } = useProfile();
  const productDoc = useProductDocument(productId);
  const firebaseApp = useFirestore();
  const { update: updateVerification } =
    useUpdateVerificationRequestWithProduct();

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

  const update = useCallback(
    async ({
      files,
      ...data
    }: {
      title: string;
      description?: string;
      tags?: string[];
      files?: File[];
      category: ProductCategory;
      duration: number[];
      address: {
        state: ProductCategory;
        pinCode: string;
      };
      pricePerMonth: number;
    }) => {
      try {
        const batch = writeBatch(firebaseApp);
        const payload = {
          ...data,
          tags: data.tags?.length ? data.tags : [''],
          availability: true,
          isUnderReview: true,
          updatedAt: serverTimestamp(),
        };
        setProgress((prevValue) => prevValue + 10);
        batch.update(productDoc, { ...payload });
        setProgress((prevValue) => prevValue + 5);
        await updateVerification(productId);
        setProgress((prevValue) => prevValue + 5);
        if (files?.length) {
          const images = await uploadImages(files, productId);
          batch.update(productDoc, {
            productMedia: product.productMedia
              ? [...product.productMedia, ...images]
              : [...images],
          });
        }
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
    update,
  };
}

export function useProducts() {
  const productsCollection = useProductsCollection();
  const { data: user } = useUser();
  const productsQuery = query(
    productsCollection,
    where('ownerId', '!=', user?.uid || 'missing'),
    orderBy('ownerId'),
    orderBy('creationAt', 'desc')
  );
  const { data: products } = useFirestoreCollectionData(productsQuery, {
    idField: 'id',
  });
  return {
    products,
  };
}

type ProductSearchParams = {
  query?: string;
  category?: Categories;
  type?: 'popular';
};

export function useSearchProducts() {
  const { products: baseProducts } = useProducts();
  const {
    values: params,
    handleChange: handleParamsChange,
    setFieldValue,
  } = useFormik<ProductSearchParams>({
    initialValues: { query: '' },
    onSubmit: () => undefined,
  });
  const hasAppliedFilters = useMemo(() => {
    return Boolean(params.query?.trim() || params.category || params.type);
  }, [params]);
  const products = useMemo(() => {
    if (!hasAppliedFilters) return baseProducts;
    let filteredProducts = baseProducts.filter((p) => {
      if (params.query?.trim()) {
        if (
          !p.title.toLowerCase().includes(params.query.trim().toLowerCase())
        ) {
          return false;
        }
      }
      if (params.category) {
        if (p.category.id !== params.category) {
          return false;
        }
      }
      return true;
    });
    if (params.type) {
      if (params.type === 'popular') {
        filteredProducts = filteredProducts.sort(
          (a, b) => (a.viewCount || 0) - (b.viewCount || 0)
        );
      }
    }
    return filteredProducts;
  }, [baseProducts, params]);
  return {
    allProducts: baseProducts,
    products,
    params,
    hasAppliedFilters,
    handleParamsChange,
    setParamValue: setFieldValue,
  };
}

export function useUpdateProductWithVerification(
  productId: string,
  reqId: string
) {
  const firebaseApp = useFirestore();
  const productDoc = useProductDocument(productId);
  const { reject, approve } = useUpdateVerificationById(reqId);
  const rejectVerification = useCallback(async (reasonsToReject: string[]) => {
    try {
      const batch = writeBatch(firebaseApp);
      batch.update(productDoc, {
        isUnderReview: false,
        reviewStatus: 'rejected',
        rejectDetails: reasonsToReject,
      });
      await reject(reasonsToReject);
      await batch.commit();
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }, []);

  const approveVerification = useCallback(async () => {
    try {
      const batch = writeBatch(firebaseApp);
      batch.update(productDoc, {
        isUnderReview: false,
        reviewStatus: 'approved',
      });
      await approve();
      await batch.commit();
    } catch (e) {
      const err = e as Error;
      throw new Error(err.message);
    }
  }, []);

  return {
    rejectVerification,
    approveVerification,
  };
}
