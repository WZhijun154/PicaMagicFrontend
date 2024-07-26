"use client";

import { useRouter } from "next/navigation";
import { emailPlaceHolder, passwordPlaceHolder } from "@/utils/constStr";
import { useTransition, useState } from "react";
import React from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Card,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Background } from "@/components/background";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { signIn } from "@/plugins/supabase/auth";
import { useUser } from "@/hooks/use-user";
import { AuthStatus } from "@/types/auth";

export default function SignInPage() {
  const themeColor = useCurrentThemeColor({});
  const [isVisible, setIsVisible] = React.useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmited, setFormSubmited] = useState(false);

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

  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const { user, userSignIn, userSignOut } = useUser();
  const [isPending, setTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setFormSubmited(true);

    if (
      isInvalidEmail ||
      isInvalidPassword ||
      email === "" ||
      password === ""
    ) {
      return;
    }

    setTransition(async () => {
      const { data, authStatus } = await signIn(formData);
      if (authStatus === AuthStatus.EMAIL_NOT_CONFIRMED) {
        console.error(authStatus);
        // TODO maybe need to use alert
        return;
      } else if (authStatus === AuthStatus.INVALID_LOGIN_CREDENTIALS) {
        console.error(authStatus);
        // TODO maybe need to use alert
        return;
      }
      userSignIn(data.user);
      // setTransition(() => {
      //   setUser(data.user);
      // });
      router.push("/");
    });
  };

  return (
    <>
      <Background />
      <div className="flex flex-row items-center justify-center mt-48">
        <Card className="animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Sign In</p>
          <form className="flex flex-col gap-3">
            <Input
              label="Email Address"
              name="email"
              placeholder={emailPlaceHolder}
              type="email"
              variant="bordered"
              color={themeColor as any}
              isInvalid={isInvalidEmail}
              onValueChange={setEmail}
              errorMessage="Invalid email address"
            />
            <Input
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
              label="Password"
              name="password"
              placeholder={passwordPlaceHolder}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={setPassword}
              isInvalid={isInvalidPassword}
              errorMessage="Password must be at least 6 characters long"
            />
            <div className="flex items-center justify-between px-1 py-2">
              <Checkbox
                name="remember"
                size="sm"
                color={themeColor as any}
                defaultSelected
              >
                Remember me
              </Checkbox>
              <Link
                className="text-default-500"
                href="#"
                size="sm"
                color={themeColor as any}
              >
                Forgot password?
              </Link>
            </div>
            <Button
              color={themeColor as any}
              type="submit"
              formAction={handleSubmit}
              isLoading={isPending}
            >
              Sign in
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
              Continue with Google
            </Button>
            <Button
              startContent={
                <Icon
                  className="text-default-500"
                  icon="fe:github"
                  width={24}
                />
              }
              variant="bordered"
            >
              Continue with Github
            </Button>
          </div> */}
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href="/signup" size="sm" color={themeColor as any}>
              Sign Up
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
