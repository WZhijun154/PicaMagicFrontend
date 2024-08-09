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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Background } from "@/components/background";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { signIn } from "@/plugins/supabase/auth";
import { useUser } from "@/hooks/use-user";
import { AuthStatus } from "@/types/auth";
import { useDisclosure } from "@nextui-org/react";
import { sendResetPasswordEmail } from "@/plugins/supabase/auth";
import toast, { Toaster } from "react-hot-toast";

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

  // const { user, userSignIn, userSignOut } = useUser();
  const [isSubmitPending, setSubmitTransition] = useTransition();

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

    setSubmitTransition(async () => {
      try {
        const { authStatus } = await signIn(formData);
        if (authStatus !== AuthStatus.SUCCESS) {
          if (authStatus === AuthStatus.INVALID_LOGIN_CREDENTIALS) {
            toast.error("Invalid email or password");
          } else {
            toast.error("Something went wrong, please try again later");
          }
          return;
        }
      } catch (error) {
        toast.error("Something went wrong, please try again later");
        return;
      }
      toast.success("Signed in successfully");
      router.push("/");
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSendingEmailPending, setSendEmailTransition] = useTransition();

  const handleSendPasswordResetEmail = () => {
    if (isInvalidEmail) {
      return;
    }

    setSendEmailTransition(async () => {
      const { authStatus } = await sendResetPasswordEmail(email);
      if (authStatus !== AuthStatus.SUCCESS) {
        toast.error("Failed to send email, please try again later");
        return;
      }
      toast.success("Email sent successfully");
      onClose();
    });
  };

  return (
    <>
      <Background />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Forgot Password</ModalHeader>
          <ModalBody>
            <p className="text-default-500">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
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
          </ModalBody>
          <ModalFooter>
            <Button color={themeColor as any} onClick={onClose} variant="light">
              Cancel
            </Button>
            <Button
              color={themeColor as any}
              onClick={handleSendPasswordResetEmail}
              isLoading={isSendingEmailPending}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
              <button type="button" onClick={onOpen}>
                <p className="text-default-500 text-sm">Forgot password?</p>
              </button>
            </div>
            <Button
              color={themeColor as any}
              type="submit"
              formAction={handleSubmit}
              isLoading={isSubmitPending}
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
