"use client";

import { Button } from "@/src/elements/ui/button";
import { ChangePasswordPayload } from "@/src/types/auth";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { useChangePasswordMutation } from "@/src/redux/api/authApi";
import { useFormik } from "formik";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as Yup from "yup";

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validationSchema = Yup.object({
    current_password: Yup.string().required(t("validation_required")),
    new_password: Yup.string()
      .min(8, t("validation_password_min", { min: 8 }))
      .required(t("validation_required")),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], t("validation_passwords_match"))
      .required(t("validation_required")),
  });

  const formik = useFormik<ChangePasswordPayload & { confirm_password: string }>({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword({
          current_password: values.current_password,
          new_password: values.new_password,
        }).unwrap();
        toast.success(t("password_change_success"));
        resetForm();
      } catch (error: unknown) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || t("password_change_failed"));
      }
    },
  });

  return (
    <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-(--text-green-primary)" />
          {t("change_password")}
        </CardTitle>
        <CardDescription>{t("change_password_desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="current_password">{t("current_password")}</Label>
              <div className="relative group">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                <Input id="current_password" type={showCurrentPassword ? "text" : "password"} placeholder={t("current_password_placeholder")} className="pl-10 py-5.5 pr-10 dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("current_password")} />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.current_password && formik.errors.current_password && <p className="text-red-500 text-xs">{formik.errors.current_password}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="new_password">{t("new_password")}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                <Input id="new_password" type={showNewPassword ? "text" : "password"} placeholder={t("new_password_placeholder")} className="pl-10 py-5.5 pr-10 dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("new_password")} />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.new_password && formik.errors.new_password && <p className="text-red-500 text-xs">{formik.errors.new_password}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="confirm_password">{t("confirm_password")}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors" />
                <Input id="confirm_password" type={showConfirmPassword ? "text" : "password"} placeholder={t("confirm_password_placeholder")} className="pl-10 py-5.5 pr-10 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" {...formik.getFieldProps("confirm_password")} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password && <p className="text-red-500 text-xs">{formik.errors.confirm_password}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading || !formik.dirty} className="bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white px-8 h-11 flex items-center gap-2 transition-all">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {t("update_password")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
