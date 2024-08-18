"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import emitter from "@/libs/emitter";

const hideOnPaths = ["examples"];

export const ProBanner = () => {
  const pathname = usePathname();
  const shouldBeVisible = !hideOnPaths.some((path) => pathname.includes(path));

  useEffect(() => {
    if (!shouldBeVisible) return;

    const handleScroll = () => {
      emitter.emit(
        "proBannerVisibilityChange",
        window.scrollY < 48 ? "visible" : "hidden"
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldBeVisible]);

  if (!shouldBeVisible) return null;

  return (
    <div className="relative z-50 isolate flex items-center gap-x-6 overflow-hidden bg-background border-b-1 border-divider px-6 py-2 sm:px-3.5 sm:before:flex-1">
      <BackgroundDecoration />
      <div className="flex w-full items-center justify-between md:justify-center gap-x-3">
        <span aria-label="construction" className="hidden md:block" role="img">
          🚧
        </span>
        <span className="inline-flex md:ml-1 animate-text-gradient font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,#D6009A_0%,#8a56cc_50%,#D6009A_100%)] dark:bg-[linear-gradient(90deg,#FFEBF9_0%,#8a56cc_50%,#FFEBF9_100%)]">
          Thank you for your patience! Our AI feature is still under development
          and will be available soon.
        </span>
      </div>
    </div>
  );
};

const BackgroundDecoration = () => (
  <>
    <div
      aria-hidden="true"
      className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
    >
      <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] dark:from-[#F54180] dark:to-[#338EF7] opacity-20 dark:opacity-10"
        style={{
          clipPath:
            "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
        }}
      />
    </div>
    <div
      aria-hidden="true"
      className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
    >
      <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] dark:from-[#F54180] dark:to-[#338EF7] opacity-30 dark:opacity-20"
        style={{
          clipPath:
            "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
        }}
      />
    </div>
  </>
);
