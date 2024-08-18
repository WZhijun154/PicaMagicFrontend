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
import toast from "react-hot-toast";
import { useDictionary } from "@/components/dictionary-provider";

export default function SignInPage() {
  const themeColor = useCurrentThemeColor({});
  const [isVisible, setIsVisible] = React.useState(false);
  const dictionary = useDictionary();

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
            toast.error(dictionary.auth.invalidLoginCredentials);
          } else {
            toast.error(dictionary.somethingWentWrong);
          }
          return;
        }
      } catch (error) {
        toast.error(dictionary.somethingWentWrong);
        return;
      }
      toast.success(dictionary.auth.signInSuccess);
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
        toast.error(dictionary.failedToSendEmail);
        return;
      }
      toast.success(dictionary.emailSent);
      onClose();
    });
  };

  return (
    <>
      {/* <Background /> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{dictionary.auth.resetPassword}</ModalHeader>
          <ModalBody>
            <p className="text-default-500">
              {dictionary.auth.resetPasswordGuide}
            </p>
            <Input
              label={dictionary.auth.emailAddress}
              name="email"
              placeholder={dictionary.auth.emailPlaceholder}
              type="email"
              variant="bordered"
              color={themeColor as any}
              isInvalid={isInvalidEmail}
              onValueChange={setEmail}
              errorMessage={dictionary.auth.invalidEmailAddress}
              value={email}
            />
          </ModalBody>
          <ModalFooter>
            <Button color={themeColor as any} onClick={onClose} variant="light">
              {dictionary.cancel}
            </Button>
            <Button
              color={themeColor as any}
              onClick={handleSendPasswordResetEmail}
              isLoading={isSendingEmailPending}
            >
              {dictionary.send}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-row items-center justify-center mt-48">
        <Card className="animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">{dictionary.auth.signIn}</p>
          <form className="flex flex-col gap-3">
            <Input
              label={dictionary.auth.emailAddress}
              name="email"
              placeholder={dictionary.auth.emailPlaceholder}
              type="email"
              variant="bordered"
              color={themeColor as any}
              isInvalid={isInvalidEmail}
              onValueChange={setEmail}
              errorMessage={dictionary.auth.invalidEmailAddress}
              value={email}
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
              label={dictionary.auth.password}
              name="password"
              placeholder={dictionary.auth.passwordPlaceholder}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={setPassword}
              isInvalid={isInvalidPassword}
              errorMessage={dictionary.auth.passwordNotLongEnough}
            />
            <div className="flex items-center justify-between px-1 py-2">
              <Checkbox
                name="remember"
                size="sm"
                color={themeColor as any}
                defaultSelected
              >
                {dictionary.auth.rememberMe}
              </Checkbox>
              <button type="button" onClick={onOpen}>
                <p className="text-default-500 text-sm">
                  {dictionary.auth.forgotPasswordQuery}
                </p>
              </button>
            </div>
            <Button
              color={themeColor as any}
              type="submit"
              formAction={handleSubmit}
              isLoading={isSubmitPending}
            >
              {dictionary.auth.signIn}
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
            {dictionary.auth.createAccountQuery}&nbsp;
            <Link href="/signup" size="sm" color={themeColor as any}>
              {dictionary.auth.signUp}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
