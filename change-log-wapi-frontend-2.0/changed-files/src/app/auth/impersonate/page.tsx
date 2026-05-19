"use client";


import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/src/constants";

export default function ImpersonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("No impersonation token found");
      toast.error("Invalid impersonation request");
      router.push(ROUTES.Login);
      return;
    }

    const handleImpersonation = async () => {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("selectedChat");
          localStorage.removeItem("selectedPhoneNumberId");
          localStorage.removeItem("app_settings");
          localStorage.removeItem("selectedWorkspace");
          localStorage.removeItem("selected_language");
        }
        
        // 2. Clear old session if it exists
        if (token) {
          await signOut({ redirect: false });
        }
        const result = await signIn("impersonation", {
          token,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          toast.error("Impersonation failed: " + result.error);
          router.push(ROUTES.Login);
        } else {
          toast.success("Impersonation started successfully");
          router.push(ROUTES.Dashboard);
        }
      } catch {
        setError("An unexpected error occurred");
        toast.error("Failed to start impersonation");
        router.push(ROUTES.Login);
      }
    };

    handleImpersonation();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{error ? "Impersonation Failed" : "Starting Impersonation..."}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{error || "Please wait while we set up your session"}</p>
      </div>
    </div>
  );
}
