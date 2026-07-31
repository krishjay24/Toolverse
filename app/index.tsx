import { useEffect } from 'react';
import { router } from 'expo-router';
import { SplashScreen } from '@/features/splash/SplashScreen';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
