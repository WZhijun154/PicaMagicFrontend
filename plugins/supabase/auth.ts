"use server";
import { createClient } from "./server";
import { AuthStatus } from "@/types/auth";

async function retry<T>(fn: () => Promise<T>, retries: number = 5): Promise<T> {
  let attempt = 0;
  let result: any;
  while (attempt < retries) {
    result = await fn();
    if (result.error) {
      attempt++;
      continue;
    } else {
      break;
    }
  }
  return result;
}

const processError = (error: any) => {
  let authStatus: AuthStatus = AuthStatus.DEFAULT;
  if (error) {
    switch (error.message) {
      case AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED:
        authStatus = AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED;
        break;
      case AuthStatus.FETCH_ERROR:
        authStatus = AuthStatus.FETCH_ERROR;
        break;
      case AuthStatus.ERROR_SENDING_CONFIRMATION_MAIL:
        authStatus = AuthStatus.ERROR_SENDING_CONFIRMATION_MAIL;
        break;
      case AuthStatus.FETCH_FAILED:
        authStatus = AuthStatus.FETCH_FAILED;
        break;
      case AuthStatus.INVALID_LOGIN_CREDENTIALS:
        authStatus = AuthStatus.INVALID_LOGIN_CREDENTIALS;
        break;
      default:
        authStatus = AuthStatus.DEFAULT;
        break;
    }
  } else {
    authStatus = AuthStatus.SUCCESS;
  }
  return authStatus;
};

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const _signIn = async () => {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  };

  try {
    const { data, error } = await retry(_signIn, 5);
    return { data, authStatus: processError(error) };
  } catch (error) {
    return { data: null, authStatus: AuthStatus.FETCH_FAILED };
  }
};

export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const supabase = await createClient();
  const _signUp = async () => {
    return await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });
  };

  try {
    // const { data, error } = await retry(_signUp, 5);
    // since signup requires sending a confirmation email, we don't need to retry
    const { data, error } = await _signUp();
    return { data, authStatus: processError(error) };
  } catch (error) {
    return { data: null, authStatus: AuthStatus.FETCH_FAILED };
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    return processError(error);
  } catch {
    return AuthStatus.FETCH_FAILED;
  }
};

export const getUser = async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    return { data, authStatus: processError(error) };
  } catch (error) {
    return { data: null, authStatus: AuthStatus.FETCH_FAILED };
  }
};

export const resetPassword = async (formData: FormData) => {
  const newPassword = formData.get("confirmPassword") as string;
  const supabase = await createClient();
  try {
    const { data, error } = await retry(async () => {
      return await supabase.auth.updateUser({
        password: newPassword,
      });
    });
    return { data, authStatus: processError(error) };
  } catch (error) {
    return { data: null, authStatus: AuthStatus.FETCH_FAILED };
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email as string
    );
    return { data, authStatus: processError(error) };
  } catch (error) {
    return { data: null, authStatus: AuthStatus.FETCH_FAILED };
  }
};
