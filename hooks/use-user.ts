import { useEffect, useState } from 'react';
import { getUser } from '@/plugins/supabase/auth';
import { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData.user);
    };

    fetchUser();
  }, [pathname]);

  return { user, setUser };
}