import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  AuthProvider,
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

function App() {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  return (
    <FirestoreProvider sdk={firestore}>
      <StorageProvider sdk={storage}>
        <AuthProvider sdk={auth}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
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
              </Route>
              <Route path="" element={<Home />} />
            </Route>
          </Routes>
        </AuthProvider>
      </StorageProvider>
    </FirestoreProvider>
  );
}

export default App;
