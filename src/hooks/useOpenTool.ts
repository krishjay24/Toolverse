import { router } from 'expo-router';

export function useOpenTool() {
  return (route: string) => {
    router.push(route as never);
  };
}
