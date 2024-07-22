import { useEffect, useState } from 'react';
import { getUser } from '@/plugins/supabase/auth';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (isMounted) {
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return { user, setUser };
}