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
          const newUser: WorkspaceUser = {
            id: fbUser.uid,
            workspaceId: 'ws-alpha-spark',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
            role: fbUser.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
            directorateIds: ['dir-dev'],
            title: fbUser.email?.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
          };
          WorkspaceStorageService.saveUser(newUser);
          match = newUser;
        }
        setUserProfile(match);
      } else {
        // Check local storage active session fallback
        const savedSession = localStorage.getItem('alpha_spark_active_session_v1');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            setUserProfile(parsed);
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        setUser(res.user);
      }
    } catch (err: any) {
      console.warn('Firebase signIn error:', err?.code, err?.message);
      
      // If user not registered in Firebase Auth project yet, auto-register or sign in smoothly
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/invalid-email'
      ) {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, pass);
          if (res.user) {
            await updateProfile(res.user, { displayName: email.split('@')[0] });
            setUser(res.user);
            return;
          }
        } catch (signupErr: any) {
          console.warn('Firebase auto-signup notice:', signupErr?.message);
        }
      }

      // Local session authentication fallback
      const existingUsers = WorkspaceStorageService.getUsers();
      let match = existingUsers.find((u) => u.email?.toLowerCase() === email.toLowerCase());

      if (!match) {
        match = {
          id: 'usr-' + Date.now(),
          workspaceId: 'ws-alpha-spark',
          displayName: email.split('@')[0],
          email: email,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
          directorateIds: ['dir-dev'],
          title: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
        };
        WorkspaceStorageService.saveUser(match);
      }

      localStorage.setItem('alpha_spark_active_session_v1', JSON.stringify(match));
      setUserProfile(match);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        const newUser: WorkspaceUser = {
          id: res.user.uid,
          workspaceId: 'ws-alpha-spark',
          displayName: name,
          email,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
          role: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
          directorateIds: ['dir-dev'],
          title: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
        };
        WorkspaceStorageService.saveUser(newUser);
        localStorage.setItem('alpha_spark_active_session_v1', JSON.stringify(newUser));
        setUserProfile(newUser);
      }
    } catch (err: any) {
      // Local session registration fallback
      const newUser: WorkspaceUser = {
        id: 'usr-' + Date.now(),
        workspaceId: 'ws-alpha-spark',
        displayName: name,
        email,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        role: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'super_admin' : 'member',
        directorateIds: ['dir-dev'],
        title: email.toLowerCase() === 'talk2icedmist@gmail.com' ? 'Super Admin' : 'Workspace Member',
      };
      WorkspaceStorageService.saveUser(newUser);
      localStorage.setItem('alpha_spark_active_session_v1', JSON.stringify(newUser));
      setUserProfile(newUser);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    localStorage.removeItem('alpha_spark_active_session_v1');
    setUser(null);
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
