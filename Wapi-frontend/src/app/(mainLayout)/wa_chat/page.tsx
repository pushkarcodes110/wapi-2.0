"use client";

import Chat from "@/src/components/chat";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/src/constants/route";

const InboxPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentFeatures = (user?.current_subscription?.is_custom ? user?.current_subscription?.features : user?.current_plan?.features) as any;
  const isWaChatEnabled = currentFeatures?.wa_chat !== false;

  useEffect(() => {
    if (!isWaChatEnabled) {
      router.push(ROUTES.Dashboard);
    }
  }, [isWaChatEnabled, router]);

  if (!isWaChatEnabled) return null;

  return <Chat />;
};

export default InboxPage;
