"use client";

import { useTranslation } from "react-i18next";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ChangePasswordForm from "@/src/components/profile/ChangePasswordForm";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks";
import { setPageTitle } from "@/src/redux/reducers/settingsSlice";

const ManageProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle(t("manage_profile_page_title")));

    return () => {
      dispatch(setPageTitle(""));
    };
  }, [dispatch, t]);

  return (
    <div className="relative pb-10">


      <div className="sticky top-[100px] pt-0! z-20 -mx-4  sm:-mx-6 px-4 sm:px-6 lg:-mx-8 py-3 bg-light-body-bg/80 dark:bg-(--dark-body)/80 backdrop-blur-md mb-5 space-y-2 animate-in shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-2xl mb-0 font-bold text-(--text-green-primary) tracking-tight">
          {t("manage_profile_page_title")}
        </h1>
        <p className="text-gray-400 text-sm">
          {t("manage_profile_page_description")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="xl:col-span-8">
          <ProfileForm />
        </div>
        <div className="xl:col-span-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ManageProfilePage;


