"use server";
import { getUser } from "@/plugins/supabase/auth";
import { NavbarItem } from "@nextui-org/navbar";
import { SignInButton, SignUpButton } from "./auth-state-client-part";
import { Button } from "@nextui-org/button";
import Icon from "./auth-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { NotificationCard } from "./notification-card";
import { NotificationBadge, AvatarBadge } from "./auth-state-client-part";
import { UserDropMenu } from "./auth-state-client-part";

async function AuthState() {
  const user = await getUser();

  if (!user) {
    return (
      <ul className="hidden lg:flex gap-4 justify-start items-center">
        <NavbarItem>
          <SignInButton />
        </NavbarItem>
        <NavbarItem>
          <SignUpButton />
        </NavbarItem>
      </ul>
    );
  } else {
    return (
      <>
        {/* Settings */}
        <NavbarItem className="hidden lg:flex">
          <Button isIconOnly radius="full" variant="light">
            <Icon
              className="text-default-500"
              icon="solar:settings-linear"
              width={24}
            />
          </Button>
        </NavbarItem>
        {/* Notifications */}
        <NavbarItem className="flex">
          <Popover offset={12} placement="bottom-end">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
              >
                <NotificationBadge />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationCard className="w-full shadow-none" />
            </PopoverContent>
          </Popover>
        </NavbarItem>
        {/* User Menu */}
        <NavbarItem className="px-2">
          <UserDropMenu user={user} />
        </NavbarItem>
      </>
    );
  }
}

// Solve typescript hardcode issue, not support server side rendering type checking
// As a temporary work around, we can override the type so that it returns a JSX.Element instead of a Promise
const _AuthState = AuthState as unknown as () => JSX.Element;
export { _AuthState as AuthState };
