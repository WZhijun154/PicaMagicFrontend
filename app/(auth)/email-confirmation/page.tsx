"use client";
import React from "react";
import { Link } from "@nextui-org/link";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { title, subtitle } from "@/components/primitives";
import { Spacer } from "@nextui-org/spacer";

const EmailConfirmationPage = () => {
  const themeColor = useCurrentThemeColor({});
  return (
    <>
      {/* <Background /> */}
      <div className="mt-48 flex flex-col items-center justify-center text-center">
        <p className={title({ size: "lg", color: "violet" })}>Almost there!</p>
        {/* <h1 className="text-2xl font-semibold mb-4">Almost there!</h1> */}
        <Spacer y={8} />
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          We've sent a confirmation link to your email address.
        </p>
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          Please check your inbox and click the link to complete your sign-up
          process.
        </p>

        {/* <p className={subtitle({ fullWidth: true })}>
          If you don't see the email, check your spam folder or{" "}
          <Link href="/resend-confirmation" color={themeColor as any}>
            resend confirmation email
          </Link>
        </p> */}
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          Thank you for joining PictaMagic!
        </p>
      </div>
    </>
  );
};

export default EmailConfirmationPage;
