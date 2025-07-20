import { NotificationProvider } from '@/src/context/NotificationContext';
import { ToastProvider } from '@/src/context/ToastContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === 'auth';
      if (!user && !inAuthGroup) {
        router.replace('/auth/login');
      }
      if (user && inAuthGroup) {
        router.replace('/(protected)/(tabs)/posts');
      }
    }
  }, [user, loading, segments]);

  if (loading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <NotificationProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ToastProvider>
        </NotificationProvider>
      </AuthGate>
    </AuthProvider>
  );
}
