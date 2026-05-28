"use client";

import Chat from "@/src/components/chat";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/src/constants/route";

const InboxPage = () => {
  const { subscription } = useAppSelector((state) => state.setting);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentFeatures = ((subscription as any)?.is_custom ? (subscription as any)?.features : (subscription as any)?.plan_id?.features) as any;
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
