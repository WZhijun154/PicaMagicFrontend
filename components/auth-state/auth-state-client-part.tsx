"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useCurrentThemeColor } from "@/hooks/use-current-theme-color";
import { Badge } from "@nextui-org/badge";
import { Icon } from "@iconify/react";
import { Avatar } from "@nextui-org/avatar";
import { useTransition } from "react";
import { signOut } from "@/plugins/supabase/auth";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/dropdown";
import { User } from "@supabase/supabase-js";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
import { AuthStatus } from "@/types/auth";
import toast from "react-hot-toast";

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
      <Avatar size="sm" name="Me" isBordered />
    </Badge>
  );
};

export const UserDropMenu = ({ user }: { user: User | null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentThemeColor = useCurrentThemeColor({});
  const router = useRouter();
  // const { userSignOut } = useUser();
  const [isPending, startTransition] = useTransition();
  const submitSignOut = () => {
    startTransition(async () => {
      try {
        const authStatus = await signOut();
        if (authStatus !== AuthStatus.SUCCESS) {
          toast.error("Something went wrong. Please try again.");
          return;
        }
        toast.success("Signed out successfully");
        router.push("/");
        return;
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
    });
  };
  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Sign Out</ModalHeader>
              <ModalBody className="text-center">
                <p className="text-default-500">
                  Are you sure you want to sign out?{" "}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={currentThemeColor as any}
                  variant="light"
                  onPress={onClose}
                  // fullWidth
                >
                  Cancel
                </Button>
                <Button
                  color={currentThemeColor as any}
                  onPress={submitSignOut}
                  // fullWidth
                  isLoading={isPending}
                >
                  Sign Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
          {/* <DropdownItem key="settings">My Settings</DropdownItem> */}
          {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
          {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
          {/* <DropdownItem key="system">System</DropdownItem> */}
          {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
          {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
          <DropdownItem
            key="logout"
            color={currentThemeColor as any}
            onClick={onOpen}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
