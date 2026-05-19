"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/src/constants";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/reducers/authSlice";
import { useLazyGetProfileQuery } from "@/src/redux/api/authApi";
import { authUtils } from "@/src/utils/auth";
import { toast } from "sonner";

export default function RestoreSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [getProfile] = useLazyGetProfileQuery();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No session token provided");
      router.push(ROUTES.Login);
      return;
    }
             
    const restoreSession = async () => {
      try {
        authUtils.setToken(token);
        const profileData = await getProfile(token).unwrap();
        
        if (profileData.success && profileData.user) {
          dispatch(setCredentials({ 
            user: profileData.user, 
            token: token 
          }));
          
          toast.success("Admin session restored successfully");
          router.push(ROUTES.ManageUsers);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (err: any) {
        console.error("Session restore error:", err);
        setError(err?.data?.message || err?.message || "Failed to restore session");
        toast.error("Could not restore admin session");
        setTimeout(() => router.push(ROUTES.Login), 3000);
      }
    };

    restoreSession();
  }, [token, router, dispatch, getProfile]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {error ? "Session Restore Failed" : "Restoring Admin Session..."}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {error || "Please wait while we log you back in"}
        </p>
      </div>
    </div>
  );
}
