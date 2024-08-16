"use client";

import React from "react";
import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Card,
  Spacer,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  emailPlaceHolder,
  usernamePlaceHolder,
  passwordPlaceHolder,
} from "@/utils/constStr";
import { Background } from "@/components/background";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { signUp } from "@/plugins/supabase/auth";
import { useTransition } from "react";
import { useUser } from "@/hooks/use-user";
import { AuthStatus } from "@/types/auth";
import toast from "react-hot-toast";
import { useDictionary } from "@/components/dictionary-provider";

export default function SignUpPage() {
  const themeColor = useCurrentThemeColor({});
  const dictionary = useDictionary();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formSubmited, setFormSubmited] = useState(false);
  // const [isInvalid, setIsInvalid] = useState(false);

  const isInvalidUsername = useMemo(() => {
    if (username === "" && !formSubmited) return false;
    // username must be at least 3 characters long
    return username.length < 3;
  }, [username, formSubmited]);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalidEmail = React.useMemo(() => {
    if (email === "" && !formSubmited) return false;

    return validateEmail(email) ? false : true;
  }, [email, formSubmited]);

  const isInvalidPassword = React.useMemo(() => {
    if (password === "" && !formSubmited) return false;
    // password must be at least 6 characters long
    return password.length < 6;
  }, [password, formSubmited]);

  const isInvalidConfirmPassword = React.useMemo(() => {
    if (confirmPassword === "" && !formSubmited) return false;
    return confirmPassword !== password;
  }, [confirmPassword, password, formSubmited]);

  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const router = useRouter();
  // const { user, userSignIn, userSignOut } = useUser();
  //   const { pending, action } = experimental_useFormStatus();
  const [isPending, setTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setFormSubmited(true);
    // prevent submission if any field is invalid
    if (
      isInvalidUsername ||
      isInvalidEmail ||
      isInvalidPassword ||
      isInvalidConfirmPassword ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      return;
    }

    setTransition(async () => {
      try {
        const { authStatus } = await signUp(formData);
        if (authStatus !== AuthStatus.SUCCESS) {
          toast.error(dictionary.somethingWentWrong);
          return;
        }
        router.push("/email-confirmation");
        return;
      } catch (error) {
        toast.error(dictionary.somethingWentWrong);
        return;
      }
    });
  };

  return (
    <>
      <Background />
      <div className="flex flex-row items-center justify-center mt-36">
        <Card className="animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">{dictionary.auth.signUp}</p>
          <form className="flex flex-col gap-3">
            <Input
              isRequired
              label={dictionary.auth.username}
              name="username"
              placeholder={dictionary.auth.usernamePlaceholder}
              type="text"
              variant="bordered"
              color={themeColor as any}
              isInvalid={isInvalidUsername}
              onValueChange={setUsername}
              errorMessage={dictionary.auth.usernameNotLongEnough}
            />
            <Input
              isRequired
              label={dictionary.auth.emailAddress}
              name="email"
              placeholder={dictionary.auth.emailPlaceholder}
              type="email"
              variant="bordered"
              color={themeColor as any}
              isInvalid={isInvalidEmail}
              onValueChange={setEmail}
              errorMessage={dictionary.auth.invalidEmailAddress}
            />
            <Input
              isRequired
              color={themeColor as any}
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label={dictionary.auth.password}
              name="password"
              placeholder={dictionary.auth.passwordPlaceholder}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={setPassword}
              isInvalid={isInvalidPassword}
              errorMessage={dictionary.auth.passwordNotLongEnough}
            />
            <Input
              color={themeColor as any}
              isRequired
              endContent={
                <button type="button" onClick={toggleConfirmVisibility}>
                  {isConfirmVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label={dictionary.auth.confirmPassword}
              name="confirmPassword"
              placeholder={dictionary.auth.confirmPasswordPlaceholder}
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
              isInvalid={isInvalidConfirmPassword}
              onValueChange={setConfirmPassword}
              errorMessage={dictionary.auth.passwordsDoNotMatch}
            />
            {/* <Checkbox
              isRequired
              className="py-4"
              size="sm"
              color={themeColor as any}
            >
              I agree with the&nbsp;
              <Link href="#" size="sm" color={themeColor as any}>
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link href="#" size="sm" color={themeColor as any}>
                Privacy Policy
              </Link>
            </Checkbox> */}
            <Spacer y={2} />
            <Button
              color={themeColor as any}
              type="submit"
              //   isLoading={pending}
              formAction={handleSubmit}
              isLoading={isPending}
            >
              {dictionary.auth.signUp}
            </Button>
          </form>
          {/* <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div> */}
          {/* <div className="flex flex-col gap-2">
        <Button
          startContent={<Icon icon="flat-color-icons:google" width={24} />}
          variant="bordered"
        >
          Sign Up with Google
        </Button>
        <Button
          startContent={
            <Icon className="text-default-500" icon="fe:github" width={24} />
          }
          variant="bordered"
        >
          Sign Up with Github
        </Button>
      </div> */}
          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="/signin" size="sm" color={themeColor as any}>
              {dictionary.auth.signIn}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
