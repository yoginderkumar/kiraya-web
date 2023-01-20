import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  AuthProvider,
  DatabaseProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from 'reactfire';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AppLayout, DashboardLayout } from './AppLayout';
import { ProtectedRoute } from './Auth';
import AddProduct from './pages/AddProduct';
import Home from './pages/Home';
import Profile from './pages/Profile';
import YourProduct from './pages/YourProduct';
import YourProducts from './pages/YourProducts';
import ProductsPage from './pages/ProductPage';
import { ForgotPasswordPage, LoginPage, SignUpPage } from './pages/Auth/index';
import { getDatabase } from 'firebase/database';
import RequestsPage, {
  RedirectToRequestsForYouIndexPage,
} from './pages/RequestsPage';
import RequestsByYouPage from './pages/RequestsByYou';
import SearchPage from './pages/SearchPage';
import RequestsForYouPage from './pages/RequestsForYou';

function App() {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const storage = getStorage(app);
  return (
    <FirestoreProvider sdk={firestore}>
      <DatabaseProvider sdk={database}>
        <StorageProvider sdk={storage}>
          <AuthProvider sdk={auth}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/" element={<AppLayout />}>
                <Route path="/products/:productId" element={<ProductsPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="your-products">
                    <Route path="" element={<YourProducts />} />
                    <Route path=":productId" element={<YourProduct />} />
                    <Route path="add-product" element={<AddProduct />} />
                  </Route>
                  <Route path="" element={<Profile />} />
                  <Route path="requests" element={<RequestsPage />}>
                    <Route
                      path="requests-for-you"
                      element={<RequestsForYouPage />}
                    />
                    <Route
                      path="requests-by-you"
                      element={<RequestsByYouPage />}
                    />
                    <Route
                      path=""
                      element={<RedirectToRequestsForYouIndexPage />}
                    />
                  </Route>
                </Route>
                <Route path="" element={<Home />} />
              </Route>
            </Routes>
          </AuthProvider>
        </StorageProvider>
      </DatabaseProvider>
    </FirestoreProvider>
  );
}

export default App;
