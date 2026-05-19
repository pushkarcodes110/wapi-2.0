/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useAppSelector } from "@/src/redux/hooks";
import { resetPasswordSchema } from "@/src/utils/validationSchema";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { CheckCircle2, Eye, EyeOff, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useResetPasswordMutation, useResetPasswordViaTokenMutation } from "@/src/redux/api/authApi";
import { DynamicLogo } from "./common/DynamicLogo";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { authRedirectField: email } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [resetPasswordByEmail, { isLoading: isEmailResetLoading }] = useResetPasswordMutation();
  const [resetPasswordByToken, { isLoading: isTokenResetLoading }] = useResetPasswordViaTokenMutation();

  const isLoading = isEmailResetLoading || isTokenResetLoading;

  useEffect(() => {
    if (!token && !email) {
      router.push(ROUTES.Login);
    }
  }, [email, token, router]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (token) {
          response = await resetPasswordByToken({
            token,
            new_password: values.password,
          }).unwrap();
        } else {
          response = await resetPasswordByEmail({
            email,
            new_password: values.password,
          }).unwrap();
        }
        toast.success(response.message || t("password_reset_success"));
        setResetSuccess(true);
        setTimeout(() => {
          router.push(ROUTES.Login);
        }, 3000);
      } catch (error: any) {
        toast.error(error?.data?.message || t("password_reset_failed"));
      }
    },
  });

  const passwordRequirements = [
    { label: t("req_8_chars"), met: formik.values.password.length >= 8 },
    { label: t("req_uppercase"), met: /[A-Z]/.test(formik.values.password) },
    { label: t("req_lowercase"), met: /[a-z]/.test(formik.values.password) },
    { label: t("req_number"), met: /\d/.test(formik.values.password) },
    { label: t("req_special"), met: /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = formik.values.password === formik.values.confirmPassword && formik.values.confirmPassword !== "";

  const handleLoginRedirect = () => {
    router.push(ROUTES.Login);
  };

  const securityFeatures = [t("sec_bank_level"), t("sec_2fa"), t("sec_session"), t("sec_logs")];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          <div className="hidden lg:flex flex-col justify-center p-12 bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-l-3xl relative overflow-hidden min-h-175">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-8 w-1 h-40 bg-white/20 rotate-12"></div>
            <div className="absolute top-1/3 left-8 w-1 h-32 bg-white/20 -rotate-12"></div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <DynamicLogo />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">{t("secure_password_reset")}</span>
                </div>
                <h2 className="text-4xl text-white leading-tight mb-4">
                  {t("create_strong_title")}
                  <br />
                  <span className="text-emerald-100">{t("new_password_title_part")}</span>
                </h2>
                <p className="text-emerald-50 text-lg">{t("secure_password_desc")}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  {t("password_best_practices")}
                </h3>
                <ul className="space-y-3 text-emerald-50">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-300 mt-0.5">✓</span>
                    {t("tip_unique")}
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-300 mt-0.5">✓</span>
                    {t("tip_mix")}
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-300 mt-0.5">✓</span>
                    {t("tip_avoid")}
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-300 mt-0.5">✓</span>
                    {t("tip_manager")}
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-emerald-100 font-semibold mb-4">{t("account_security_title")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {securityFeatures.map((feature, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center">
                      <p className="text-white text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white lg:rounded-r-3xl shadow-2xl p-8 lg:p-12 min-h-175 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-100 to-teal-100 opacity-50 rounded-bl-full"></div>

            <div className="relative z-10 max-w-md mx-auto w-full">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>

              {!resetSuccess ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl text-slate-900 mb-2">{t("reset_your_password_header")}</h2>
                    <p className="text-slate-600">
                      {token ? t("creating_password_for_link") : `${t("creating_password_for")} `}
                      {!token && <span className="font-semibold text-slate-900">{email}</span>}
                    </p>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                        {t("new_password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("new_password_placeholder")} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-11 border border-(--input-border-color) focus:border-primary rounded-lg text-base" />
                        <Button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                      {formik.touched.password && formik.errors.password && <p className="text-sm text-red-500">{formik.errors.password}</p>}
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                        {t("confirm_new_password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder={t("confirm_new_password_placeholder")} value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-11 border border-(--input-border-color) focus:border-primary rounded-lg text-base" />
                        <Button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                      <p className="text-sm font-semibold text-slate-900 mb-3">{t("password_requirements_header")}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2.5 text-sm">
                            {req.met ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>}
                            <span className={req.met ? "text-emerald-700 font-medium" : "text-slate-600"}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-13 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all text-base font-semibold" disabled={isLoading || !allRequirementsMet || !passwordsMatch}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("resetting_password")}
                        </div>
                      ) : (
                        t("reset_password_button")
                      )}
                    </Button>

                    <div className="text-center pt-2">
                      <p className="text-slate-600 text-sm">
                        {t("remember_password")}{" "}
                        <Button type="button" onClick={handleLoginRedirect} className="bg-transparent hover:bg-transparent px-0 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                          {t("sign_in_here")}
                        </Button>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-2 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>

                  <div>
                    <h3 className="text-2xl text-slate-900 mb-3">{t("password_reset_success_title")}</h3>
                    <p className="text-slate-600 text-lg">{t("password_reset_success_desc")}</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                    <div className="flex items-center justify-center gap-2 text-primary mb-2">
                      <ShieldCheck className="w-5 h-5" />
                      <p className="font-semibold">{t("account_secure_msg")}</p>
                    </div>
                    <p className="text-primary text-sm">{t("redirecting_login")}</p>
                  </div>

                  <Button onClick={handleLoginRedirect} className="w-full h-12 bg-primary text-white rounded-lg shadow-lg shadow-emerald-500/30">
                    {t("continue_login")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
