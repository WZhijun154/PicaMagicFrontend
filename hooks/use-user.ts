import { useEffect } from "react";
import { getUser } from "@/plugins/supabase/auth";
import { User } from "@supabase/supabase-js";
import { userAtom } from "@/atoms/userAtom";
import { useAtom } from "jotai";
import { AuthStatus } from "@/types/auth";

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  const userSignIn = (userData: User | null) => {
    setUser(userData);
  };

  const userSignOut = () => {
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const { data, authStatus } = await getUser();
      if (authStatus === AuthStatus.SUCCESS) {
        setUser(data!.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    // console.log('fetching user');
    fetchUser();
  }, []);

  return { user, userSignIn, userSignOut };
};
