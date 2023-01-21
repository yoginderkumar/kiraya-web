import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AuthProvider,
  DatabaseProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from 'reactfire';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProtectedRoute } from './pages/Auth';
import { LoginPage } from './pages/Auth/index';
import { getDatabase } from 'firebase/database';
import { DashboardLayout } from './AppLayout';
import ProfilePage from './pages/Profile';
import RequestsPage from './pages/RequestsPage';
import RequestPage from './pages/RequestPage';

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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/requests">
                  <Route path=":requestId" element={<RequestPage />} />
                  <Route path="" element={<RequestsPage />} />
                </Route>
                <Route path="" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </StorageProvider>
      </DatabaseProvider>
    </FirestoreProvider>
  );
}

export default App;
