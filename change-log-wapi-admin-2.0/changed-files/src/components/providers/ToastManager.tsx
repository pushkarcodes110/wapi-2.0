"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ToastManagerContent = () => {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const loginSuccess = searchParams.get("login_success");
        if (loginSuccess) {
            toast.success(t("auth_login_success") || "Login successful.");
            
            // Remove the parameter from the URL using the history API to avoid re-renders
            const params = new URLSearchParams(window.location.search);
            params.delete("login_success");
            const query = params.toString();
            const newUrl = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
            window.history.replaceState(null, "", newUrl);
        }
    }, [searchParams, pathname, t]);

    return null;
};

export const ToastManager = () => {
    return (
        <Suspense fallback={null}>
            <ToastManagerContent />
        </Suspense>
    );
};
