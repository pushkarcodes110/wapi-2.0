"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/src/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setUser } from "@/src/redux/reducers/authSlice";
import { UpdateProfilePayload } from "@/src/types/auth";
import { useFormik } from "formik";
import { Loader2, Mail, Notebook, Phone, Save, User } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as Yup from "yup";
import CountrySelect from "../../shared/CountrySelect";

const ProfileForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { data: profileData, isLoading: isFetching } = useGetProfileQuery(token || undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profileData?.user) {
      dispatch(setUser(profileData.user));
    }
  }, [profileData, dispatch]);

  const handleCountryChange = (country: { name: string; dial_code: string }) => {
    formik.setFieldValue("country", country.name);
    formik.setFieldValue("country_code", country.dial_code);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("validation_required")),
    email: Yup.string().email(t("validation_invalid_email")).required(t("validation_required")),
    phone: Yup.string()
      .matches(/^\d{6,15}$/, t("validation_phone_digits"))
      .required(t("validation_required")),
    country: Yup.string().required(t("validation_required")),
    country_code: Yup.string().required(t("validation_required")),
    note: Yup.string(),
  });

  const formik = useFormik<UpdateProfilePayload>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      country: user?.country || "",
      country_code: user?.country_code || "",
      note: user?.note || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile(values).unwrap();
        dispatch(setUser({ ...user!, ...values }));
        toast.success(t("update_success"));
      } catch (error: unknown) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || t("update_failed"));
      }
    },
  });

  if (isFetching && !user) {
    return (
      <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-slate-500">{t("common_loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-(--text-green-primary)" />
          {t("personal_information")}
        </CardTitle>
        <CardDescription>{t("personal_information_desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="name">{t("full_name")}</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                <Input id="name" placeholder={t("full_name_placeholder")} className="pl-10 py-5.5 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 bg-(--input-color) focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("name")} />
              </div>
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs">{formik.errors.name}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="email">{t("email_address")}</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                <Input id="email" type="email" placeholder={t("email_placeholder")} className="pl-10 py-5.5 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 bg-(--input-color) focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("email")} />
              </div>
              {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs">{formik.errors.email}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="country">{t("country_name")}</Label>
              <CountrySelect
                value={formik.values.country}
                onSelect={(country) => handleCountryChange(country)}
                placeholder={t("country_placeholder")}
                className="w-full dark:border-(--card-border-color)"
              />
              {formik.touched.country && formik.errors.country && <p className="text-red-500 text-xs">{formik.errors.country}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="phone">{t("phone_number")}</Label>
              <div className="flex gap-2">
                <div className="w-20 shrink-0">
                  <Input value={formik.values.country_code} disabled placeholder="+1" className="p-5.5 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 text-center" />
                </div>
                <div className="relative flex-1 group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                  <Input
                    id="phone"
                    type="number"
                    placeholder={t("phone_placeholder")}
                    className="pl-10 py-5.5 dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)"
                    {...formik.getFieldProps("phone")}
                    onChange={(e) => formik.setFieldValue("phone", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs">{formik.errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="note">{t("note_label")}</Label>
            <div className="relative group">
              <Notebook className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
              <Textarea id="note" placeholder={t("note_placeholder")} className="pl-10 min-h-24 dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("note")} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isUpdating || !formik.dirty} className="bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white px-8 h-11 flex items-center gap-2 transition-all">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t("save_changes")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
