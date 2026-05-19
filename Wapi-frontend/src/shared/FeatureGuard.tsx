/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../app/loading";
import { ROUTES } from "../constants";

interface FeatureGuardProps {
  children: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const restrictedPaths = [ROUTES.MessageTemplates, ROUTES.MessageCampaigns, ROUTES.Orders, ROUTES.Catalogues, ROUTES.TemplatesLibrary, ROUTES.Webhooks,ROUTES.AppointmentBooking,ROUTES.WhatsappForm,ROUTES.AICall, ROUTES.AICallAgents,ROUTES.AICallLogs,ROUTES.AICallAgentsCreate,ROUTES.AICallAgentsEdit];

  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const isRestricted = useMemo(() => {
    if (!isBaileys) return false;
    return restrictedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  }, [isBaileys, pathname]);

  useEffect(() => {
    if (isAuthenticated && isRestricted) {
      setIsRedirecting(true);
      router.replace(ROUTES.Dashboard);
    }
  }, [isAuthenticated, isRestricted, router]);

  useEffect(() => {
    if (!isRestricted && isRedirecting) {
      setIsRedirecting(false);
    }
  }, [pathname, isRestricted, isRedirecting]);

  if (authLoading || (isRestricted && isRedirecting)) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default FeatureGuard;
