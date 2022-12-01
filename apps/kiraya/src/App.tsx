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
import { AppLayout } from './AppLayout';
import { ProtectedRoute } from './Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';

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
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/profile" element={<AppLayout />}>
              <Route
                path=""
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </StorageProvider>
    </FirestoreProvider>
  );
}

export default App;
