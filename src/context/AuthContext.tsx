'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { User as WorkspaceUser } from '../types';
import { WorkspaceStorageService } from '../lib/storage';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: WorkspaceUser | null;
  loading: boolean;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<WorkspaceUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        // Map to WorkspaceUser profile or create default
        const existingUsers = WorkspaceStorageService.getUsers();
        let match = existingUsers.find((u) => u.email?.toLowerCase() === fbUser.email?.toLowerCase());

        if (!match) {
          match = {
            id: fbUser.uid,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            role: 'member',
            directorateId: 'dir-exec',
            title: 'Workspace Member',
          };
          WorkspaceStorageService.saveUser(match);
        }
        setUserProfile(match);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const newUser: WorkspaceUser = {
        id: res.user.uid,
        displayName: name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.user.uid}`,
        role: 'member',
        directorateId: 'dir-exec',
        title: 'Workspace Member',
      };
      WorkspaceStorageService.saveUser(newUser);
      setUserProfile(newUser);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
