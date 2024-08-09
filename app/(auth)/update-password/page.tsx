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
import { resetPassword } from "@/plugins/supabase/auth";
import { useTransition } from "react";
import { AuthStatus } from "@/types/auth";
import toast from "react-hot-toast";
// import toast, { Toaster } from "react-hot-toast";

export default function PasswordResetPage() {
  const themeColor = useCurrentThemeColor({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formSubmited, setFormSubmited] = useState(false);
  // const [isInvalid, setIsInvalid] = useState(false);

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
  //   const { pending, action } = experimental_useFormStatus();
  const [isPending, setTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setFormSubmited(true);
    // prevent submission if any field is invalid
    if (
      isInvalidPassword ||
      isInvalidConfirmPassword ||
      password === "" ||
      confirmPassword === ""
    ) {
      return;
    }

    setTransition(async () => {
      try {
        const { authStatus } = await resetPassword(formData);
        if (authStatus !== AuthStatus.SUCCESS) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
        toast.success("Password reset successfully");
        router.push("/");
        return;
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      <Background />
      <div className="flex flex-row items-center justify-center mt-36">
        <Card className="animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Reset Password</p>
          <form className="flex flex-col gap-3">
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
              label="New Password"
              name="password"
              placeholder={passwordPlaceHolder}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={setPassword}
              isInvalid={isInvalidPassword}
              errorMessage="Password must be at least 6 characters long"
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
              label="Confirm New Password"
              name="confirmPassword"
              placeholder={passwordPlaceHolder}
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
              isInvalid={isInvalidConfirmPassword}
              onValueChange={setConfirmPassword}
              errorMessage="Passwords do not match"
            />
            <Spacer y={2} />
            <Button
              color={themeColor as any}
              type="submit"
              formAction={handleSubmit}
              isLoading={isPending}
            >
              Reset
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
