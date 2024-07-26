"use server";
import { createClient } from "./server";
import { AuthStatus } from "@/types/auth"; 


export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  let authStatus: AuthStatus = AuthStatus.DEFAULT;
  if (error?.message === AuthStatus.EMAIL_NOT_CONFIRMED) {
    authStatus = AuthStatus.EMAIL_NOT_CONFIRMED;
  } else if (error?.message === AuthStatus.INVALID_LOGIN_CREDENTIALS) {
    authStatus = AuthStatus.INVALID_LOGIN_CREDENTIALS;
  } else {
    authStatus = AuthStatus.SUCCESS;
  }
  return {data, authStatus}
};


export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const supabase = await createClient();

  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
      },
    },
  });

  let authStatus: AuthStatus = AuthStatus.DEFAULT;
  if (error?.message === AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED) {
    authStatus = AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED;
  } else {
    authStatus = AuthStatus.SUCCESS;
  }

  return {data, authStatus}
};

export const signOut = async () => {
  const supabase = await createClient();
  let {error} = await supabase.auth.signOut();
  if (error) {
    error = true as any;
  }

  return error;
};

export const getUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return data.user;
}




