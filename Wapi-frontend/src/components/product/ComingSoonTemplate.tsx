/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import ProductLayout from "./ProductLayout";
import { Button } from "../../elements/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants";
import { useAppSelector } from "../../redux/hooks";
import { motion } from "framer-motion";

interface ComingSoonTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  featureName: string;
}

const ComingSoonTemplate: React.FC<ComingSoonTemplateProps> = ({ title, description, icon, featureName }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { app_name } = useAppSelector((state) => state.setting);

  return (
    <ProductLayout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]   text-center relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center justify-center p-5 mb-10 rounded-lg bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-primary border border-slate-50">
            {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-10 h-10" }) : icon}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-2 mb-8 flex-wrap gap-3">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-widest uppercase">Coming Soon</span>
            <span className="text-slate-400 font-medium">&bull;</span>
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{featureName}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[calc(18px+(41-18)*((100vw-320px)/(1920-320)))] font-black text-slate-900 leading-[1.05] tracking-tight mb-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))]">
            {title}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] text-slate-600 leading-relaxed mb-[calc(24px+(48-24)*((100vw-320px)/(1920-320)))] max-w-2xl mx-auto font-medium">
            {description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-[calc(6px+(24-6)*((100vw-320px)/(1920-320)))]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                className="bg-primary text-white px-4.5 py-5 h-12 rounded-lg font-medium text-lg transition-all hover:scale-[1.02] active:scale-95 border-2 border-black/5"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push(ROUTES.Dashboard);
                  } else {
                    router.push(ROUTES.Login);
                  }
                }}
              >
                Start Free 7 Day Trial
              </Button>
              <Button variant="outline" className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-4.5 py-5 h-12 rounded-lg font-medium text-lg transition-all" onClick={() => router.push("/#contact")}>
                Book a Demo
              </Button>
            </div>

            <div className="flex items-center gap-1 text-slate-400 font-bold text-xs tracking-widest mt-4">
              ⚡ by<span className="text-primary dark:text-primary uppercase">{app_name}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits section */}
      <section className="py-[calc(25px+(72-25)*((100vw-320px)/(1920-320)))] bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]  max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-6 text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Deployment</h3>
              <p className="text-slate-600 leading-relaxed">Connect your account and start automating in less than 5 minutes with our official Meta integration.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-6 text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Team Collaboration</h3>
              <p className="text-slate-600 leading-relaxed">Assign roles, add internal notes, and manage conversations together on a shared team dashboard.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-6 text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Official Meta Security</h3>
              <p className="text-slate-600 leading-relaxed">Synqzy is an official WhatsApp Business Solution Provider, ensuring your data is always secure and compliant.</p>
            </div>
          </div>
        </div>
      </section>
    </ProductLayout>
  );
};

export default ComingSoonTemplate;
