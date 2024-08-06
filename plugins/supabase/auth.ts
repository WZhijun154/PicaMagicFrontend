"use server";
import { createClient } from "./server";
import { AuthStatus } from "@/types/auth"; 
import { sendMail } from "@/utils/mail";

// utils/retry.ts
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


export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const userSignIn = async () => {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  };

  try {
    const { data, error } = await retry(userSignIn, 5);
    if (error) {
      
    }

    let authStatus: AuthStatus = AuthStatus.DEFAULT;
    if (error?.message === AuthStatus.EMAIL_NOT_CONFIRMED) {
      authStatus = AuthStatus.EMAIL_NOT_CONFIRMED;
    } else if (error?.message === AuthStatus.INVALID_LOGIN_CREDENTIALS) {
      authStatus = AuthStatus.INVALID_LOGIN_CREDENTIALS;
    } else {
      authStatus = AuthStatus.SUCCESS;
    }
    return {data, authStatus}

  } catch (error) {
    console.error('Failed to sign in user after multiple retries', error);
    return {data: null, authStatus: AuthStatus.FETCH_FAILED}
  };
}

export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const supabase = await createClient();

  const userSignUp = async () => {
    return await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });
  }

  try {
    const { data, error } = await retry(userSignUp, 5);
    if (error) {
      
    }
    console.log(new Date().toLocaleString());
    console.log(error?.message);
  
    let authStatus: AuthStatus = AuthStatus.DEFAULT;
    if (error?.message === AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED) {
      authStatus = AuthStatus.EMAIL_RATE_LIMIT_EXCEEDED;
    } else if (error?.name === AuthStatus.FETCH_ERROR) {
      authStatus = AuthStatus.FETCH_ERROR;
    } else if (error?.message === AuthStatus.ERROR_SENDING_CONFIRMATION_MAIL) {
      authStatus = AuthStatus.ERROR_SENDING_CONFIRMATION_MAIL;
    } else if (error?.name === AuthStatus.FETCH_FAILED) {
      authStatus = AuthStatus.FETCH_FAILED;
    } else {
      authStatus = AuthStatus.SUCCESS;
    }
    // if (authStatus === AuthStatus.SUCCESS) {
    //   const confirmationLink = `http://localhost:3000/email-confirmation/confirm?token=${data.user!.id!}`;
    //   await sendMail({
    //       to: email,
    //       subject: "Confirm your email",
    //       text: `Please confirm your email by clicking the following link: ${confirmationLink}`,
    //       html: `<a href='${confirmationLink}'>Confirm</a>`
    //   });
    // }
    return {data, authStatus}
  } catch (error) {
    console.error('Failed to sign up user after multiple retries', error);
    return {data: null, authStatus: AuthStatus.FETCH_FAILED}
  }
}

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

// export const confirmUser = async (token : string) => {
//   const supabase = await createClient();

//   const updateUser = async () => {
//     return await supabase.auth.admin.updateUserById(token, {
//         email_confirm: true,
        
//     });
//   };

//   try {
//     const { data, error } = await retry(updateUser, 5);
//     if (error) {
//         return {data: null, authStatus: AuthStatus.FETCH_FAILED};
//     }
//     return {data, authStatus: AuthStatus.EMAIL_CONFIRMED};
//   } catch (error) {
//     console.error('Failed to update user after multiple retries', error);
//     return {data: null, authStatus: AuthStatus.FETCH_FAILED}
//   }
// };




