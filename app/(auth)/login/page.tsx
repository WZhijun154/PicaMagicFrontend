"use client";
import { login, signup } from "./actions";
import { useRouter } from "next/navigation";
import { emailPlaceHolder, passwordPlaceHolder } from "@/utils/constStr";
import { createClient } from "@/plugins/supabase/client";
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
import { Background } from "@/utils/background";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";

export default function Login() {
  const themeColor = useCurrentThemeColor({});
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // failed to sign in
      console.error(error);
      return;
    }
    // redirect to dashboard
    console.log("Sign in successful");
    router.push("/");
  };

  return (
    <>
      <Background />
      <div className="flex flex-row items-center justify-center mt-48">
        <Card className="animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Log In</p>
          <form className="flex flex-col gap-3">
            <Input
              label="Email Address"
              name="email"
              placeholder={emailPlaceHolder}
              type="email"
              variant="bordered"
              color={themeColor as any}
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
            />
            <div className="flex items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm" color={themeColor as any}>
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
            >
              Log In
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
