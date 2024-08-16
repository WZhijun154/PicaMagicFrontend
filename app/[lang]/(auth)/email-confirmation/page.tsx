"use server";
import React from "react";
import { title, subtitle } from "@/components/primitives";
import { Spacer } from "@nextui-org/spacer";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

const EmailConfirmationPage = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const dictionary = await getDictionary(params.lang);

  return (
    <>
      {/* <Background /> */}
      <div className="mt-48 flex flex-col items-center justify-center text-center">
        <p className={title({ size: "lg", color: "violet" })}>Almost there!</p>
        {/* <h1 className="text-2xl font-semibold mb-4">Almost there!</h1> */}
        <Spacer y={8} />
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          {dictionary.auth.weSentConfirmationEmail}
        </p>
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          {dictionary.auth.pleaseCheckEmailToSignUp}
        </p>

        {/* <p className={subtitle({ fullWidth: true })}>
          If you don't see the email, check your spam folder or{" "}
          <Link href="/resend-confirmation" color={themeColor as any}>
            resend confirmation email
          </Link>
        </p> */}
        <p className={subtitle({ fullWidth: true, size: "md" })}>
          {dictionary.auth.thankYouForSigningUp}
        </p>
      </div>
    </>
  );
};

export default EmailConfirmationPage;
