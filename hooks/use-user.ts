import { useEffect } from 'react';
import { getUser } from '@/plugins/supabase/auth';
import { User } from '@supabase/supabase-js';
import { userAtom } from '@/atoms/userAtom';
import { useAtom } from 'jotai';

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom); 
  const userSignIn = (userData: User | null) => {
    setUser(userData);
  }

  const userSignOut = () => {
    setUser(null);
  }

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    // console.log('fetching user');
    fetchUser();
  }, []);

  return { user, userSignIn, userSignOut };
}