"use client";

import ContactImportProgressPopup from "@/src/components/contact/ContactImportProgressPopup";
import Header from "@/src/components/layouts/Header";
import ImpersonationBanner from "@/src/components/layouts/ImpersonationBanner";
import Sidebar from "@/src/components/layouts/Sidebar";
import ChatThemeProvider from "@/src/components/providers/ChatThemeProvider";
import { useContactImportProgress } from "@/src/hooks/useContactImportProgress";
import { useGetSettingsQuery, useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { resetChatState } from "@/src/redux/reducers/messenger/chatSlice";
import { setSetting, setSubscription, setUserSetting } from "@/src/redux/reducers/settingSlice";
import { clearWorkspace, setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useContactImportProgress();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarToggle } = useAppSelector((state) => state.layout);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  const prevWorkspaceIdRef = useRef(selectedWorkspace?._id);

  useEffect(() => {
    const currentWorkspaceId = selectedWorkspace?._id;
    if (currentWorkspaceId !== prevWorkspaceIdRef.current) {
      dispatch(resetChatState());
      prevWorkspaceIdRef.current = currentWorkspaceId;
    }
  }, [selectedWorkspace, dispatch]);

  const { data: workspacesData, isLoading: workspacesLoading } = useGetWorkspacesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (workspacesLoading) return;

    const workspaces = workspacesData?.data || [];

    if (workspaces.length === 0) {
      if (selectedWorkspace) {
        dispatch(clearWorkspace());
      }
      router.replace("/workspace");
      return;
    }

    if (!selectedWorkspace) {
      if (workspaces.length === 1) {
        const ws = workspaces[0];
        dispatch(setWorkspace(ws));
        return;
      }
      router.replace("/workspace");
      return;
    }

    const isValid = workspaces.some((ws) => ws._id === selectedWorkspace._id);
    if (!isValid) {
      dispatch(clearWorkspace());
      router.replace("/workspace");
    }
  }, [isAuthenticated, selectedWorkspace, workspacesData, workspacesLoading, router, dispatch, user]);

  const { data: settingUserData, isSuccess: isUserSuccess } = useGetUserSettingsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: subscriptionData, isSuccess: isSubscriptionSuccess } = useGetUserSubscriptionQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: settingData, isSuccess } = useGetSettingsQuery({});

  const sidebarToggleRef = useRef(sidebarToggle);

  useEffect(() => {
    sidebarToggleRef.current = sidebarToggle;
  }, [sidebarToggle]);

  const updateSidebarBasedOnWidth = () => {
    const windowWidth = window.innerWidth;
    const currentToggle = sidebarToggleRef.current;

    if (windowWidth >= 1025 && windowWidth <= 1199) {
      if (!currentToggle) {
        dispatch(setSidebarToggle(true));
      }
    } else if (windowWidth >= 1200) {
      if (currentToggle) {
        dispatch(setSidebarToggle(false));
      }
    }
  };

  useEffect(() => {
    updateSidebarBasedOnWidth();
    const handleResize = () => updateSidebarBasedOnWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarToggle");
    if (stored === "true") {
      dispatch(setSidebarToggle(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (settingUserData && isUserSuccess) {
      dispatch(setUserSetting(settingUserData));
    }
  }, [dispatch, isUserSuccess, settingUserData]);

  useEffect(() => {
    if (subscriptionData?.success && isSubscriptionSuccess) {
      dispatch(setSubscription(subscriptionData.data));
    }
  }, [dispatch, isSubscriptionSuccess, subscriptionData]);

  useEffect(() => {
    if (settingData && isSuccess) {
      const dataToSet = settingData.data || settingData;
      dispatch(setSetting(dataToSet));
    }
  }, [dispatch, isSuccess, settingData]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-(--dark-body) transition-colors duration-300 overflow-hidden">
      <ImpersonationBanner />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
          <Header />
          <ChatThemeProvider>
            <div className={`flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-(--page-body-bg) dark:bg-(--dark-body) ${!sidebarToggle ? "ml-66.5 rtl:mr-66.5 rtl:ml-0 [@media(max-width:1024px)]:ml-0! [@media(max-width:1024px)]:mr-0!" : "ml-20 rtl:mr-20 rtl:ml-0 [@media(max-width:1024px)]:ml-0! [@media(max-width:1024px)]:mr-0!"} transition-all duration-300`}>{children}</div>
          </ChatThemeProvider>
        </main>
        <ContactImportProgressPopup />
      </div>
    </div>
  );
};

export default Layout;
