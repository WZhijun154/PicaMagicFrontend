"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { Badge } from "@nextui-org/badge";
import { Icon } from "@iconify/react";
import { Avatar } from "@nextui-org/avatar";
import { useTransition } from "react";
import { signOut } from "@/plugins/supabase/auth";
import { useUser } from "@/hooks/use-user";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/dropdown";
import { User } from "@supabase/supabase-js";

export const SignInButton = () => {
  const router = useRouter();
  const color = useCurrentThemeColor({});

  const handleSignIn = () => {
    router.push("/signin");
  };

  return (
    <Button
      radius="full"
      variant="light"
      color={color as any}
      onClick={handleSignIn}
    >
      Sign in
    </Button>
  );
};

export const SignUpButton = () => {
  const router = useRouter();
  const color = useCurrentThemeColor({});

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <Button
      radius="full"
      variant="flat"
      color={color as any}
      onClick={handleSignUp}
    >
      Sign Up
    </Button>
  );
};

export const NotificationBadge = () => {
  const currentThemeColor = useCurrentThemeColor({});
  return (
    <Badge
      color={currentThemeColor as any}
      content="5"
      showOutline={false}
      size="md"
    >
      <Icon className="text-default-500" icon="solar:bell-linear" width={22} />
    </Badge>
  );
};

export const AvatarBadge = () => {
  const currentThemeColor = useCurrentThemeColor({});
  return (
    <Badge
      color={currentThemeColor as any}
      content=""
      placement="bottom-right"
      shape="circle"
    >
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258114e29526708c" />
    </Badge>
  );
};

export const UserDropMenu = ({ user }: { user: User | null }) => {
  const currentThemeColor = useCurrentThemeColor({});
  const router = useRouter();
  // const { userSignOut } = useUser();
  const [isPending, startTransition] = useTransition();
  const submitSignOut = () => {
    startTransition(async () => {
      const error = await signOut();
      if (error) {
        return;
      }
      // userSignOut();
      router.push("/");
    });
  };
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="mt-1 h-8 w-8 transition-transform">
          <AvatarBadge />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
        {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
        {/* <DropdownItem key="system">System</DropdownItem> */}
        {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem
          key="logout"
          color={currentThemeColor as any}
          onClick={submitSignOut}
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
