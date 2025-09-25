import { useState, useEffect } from 'react';

/**
 * Hook to detect if we're on the client side (after hydration)
 * Useful for preventing hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
