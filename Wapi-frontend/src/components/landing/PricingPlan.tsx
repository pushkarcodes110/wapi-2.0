"use client";

import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PricingPlanProps } from "../../types/landingPage";
import CurrencyValue from "@/src/shared/CurrencyValue";

type PricingFeature = {
  label: string;
  value: string | number | boolean;
};

type DisplayPlan = {
  name: string;
  description: string;
  price: number;
  currencyCode?: { code?: string } | string | null;
  priceSuffix: string;
  features: PricingFeature[];
  isPopular: boolean;
  is_featured?: boolean;
};

const PricingPlan: React.FC<PricingPlanProps> = ({ data }) => {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const plans: DisplayPlan[] = (data.plans || [])
    .map<DisplayPlan | null>((p) => {
      const planDoc = p._id;
      if (!planDoc) return null;

      const featureLimits = planDoc.features || {};
      const formattedFeatures = [
        { label: "Contacts", value: featureLimits.contacts },
        { label: "Campaigns", value: featureLimits.campaigns },
        { label: "Staff", value: featureLimits.staff },
        { label: "Conversations", value: featureLimits.conversations },
        { label: "AI Prompts", value: featureLimits.ai_prompts },
        { label: "Bot Flow", value: featureLimits.bot_flow },
        {
          label: "Rest API",
          value: featureLimits.rest_api ? "Included" : "No",
        },
        {
          label: "Webhook",
          value: featureLimits.whatsapp_webhook ? "Included" : "No",
        },
      ].filter((f) => f.value !== undefined);

      return {
        name: planDoc.name,
        description: planDoc.name.toLowerCase() === "pro" ? "Best for growing teams" : "Ideal for small projects",
        price: planDoc.price,
        currencyCode: planDoc?.currency,
        priceSuffix: `/per ${planDoc.billing_cycle || "user"}`,
        features: formattedFeatures,
        isPopular: planDoc.name.toLowerCase() === "pro",
        is_featured: planDoc.is_featured,
      };
    })
    .filter((plan): plan is DisplayPlan => plan !== null);

  if (plans.length === 3) {
    const featuredIdx = plans.findIndex((p) => p && p.is_featured);
    if (featuredIdx !== -1 && featuredIdx !== 1) {
      const featured = plans[featuredIdx];
      plans.splice(featuredIdx, 1);
      plans.splice(1, 0, featured);
    }
  }

  const handleChoosePlan = () => {
    if (isAuthenticated) {
      router.push(user?.role === "agent" ? ROUTES.WAChat : ROUTES.BillingPlans);
      return;
    }

    router.push(ROUTES.Login);
  };

  const renderPlanCard = (plan: DisplayPlan, variant: "mobile" | "desktop") => {
    const currencyCode = (typeof plan.currencyCode === "string" ? plan.currencyCode : plan.currencyCode?.code) || "USD";
    const isDesktop = variant === "desktop";

    return (
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white transition-all duration-300 ${
          plan.is_featured
            ? "border-2 border-primary shadow-[0_22px_70px_rgba(52,154,107,0.18)]"
            : "border border-slate-200 shadow-[0_12px_45px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(15,23,42,0.1)]"
        }`}
      >
        {plan.is_featured && (
          <div className="bg-primary px-5 py-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white">Most Popular</span>
          </div>
        )}

        <div className={`flex h-full flex-col ${isDesktop ? "p-6 xl:p-7" : "p-[calc(20px+(28-20)*((100vw-320px)/(1920-320)))]"}`}>
          <div className={isDesktop ? "min-h-[120px]" : "mb-6"}>
            <h3 className="text-[22px] font-bold leading-tight text-slate-900 xl:text-[24px]">{plan.name}</h3>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-500">{plan.description}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
              <div className="flex items-end gap-2">
                <CurrencyValue amount={plan.price} fromCode={currencyCode} className="text-[34px] font-extrabold leading-none tracking-tight text-slate-900 xl:text-[38px]" fallbackSymbol={currencyCode === "INR" ? "₹" : "$"} />
                <span className="pb-1 text-[14px] font-semibold leading-tight text-slate-500">{plan.priceSuffix === "/per undefined" ? "/per user" : plan.priceSuffix}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 mb-8 flex-1 space-y-3">
            {plan.features.map((feature, fIdx) => (
              <div key={fIdx} className="flex items-center gap-3">
                <BadgeCheck size={18} className="shrink-0 text-primary opacity-80" />
                <p className="text-[14px] leading-snug text-slate-600">
                  <span className="text-slate-500 opacity-90">{feature.label}: </span>
                  <span className="ml-1 font-bold text-slate-800">{feature.value}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <button onClick={handleChoosePlan} className="w-full rounded-xl bg-primary px-3 py-3 text-[15px] font-bold text-white shadow-lg shadow-primary/15 transition-all duration-300 hover:bg-[var(--primary-hover)]">
              Choose Plan
            </button>
            {plan.is_featured && (
              <p className="text-center text-[13px] font-medium text-slate-500">
                or{" "}
                <a href="#" className="border-b border-slate-900/20 font-bold text-slate-900 transition-colors hover:border-primary hover:text-primary">
                  contact sales
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="pricing" className="bg-[linear-gradient(180deg,var(--features-bg-start)_0%,var(--background)_100%)] py-[calc(60px+(140-60)*((100vw-320px)/(1920-320)))] pb-0" style={{ overflowX: "clip" }}>
      <div className="mx-[calc(16px+(160-16)*((100vw-320px)/(1920-320)))]">
        <div className="grid grid-cols-1 gap-[calc(30px+(60-30)*((100vw-320px)/(1920-320)))] lg:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.9fr)] lg:items-center">
          <div className="flex flex-col gap-[calc(20px+(40-20)*((100vw-320px)/(1920-320)))]">
            <div className="[@media(max-width:1024px)]:text-center">
              <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">{data.badge || "Pricing Plan"}</span>
              <h2 className="mt-4 whitespace-pre-wrap text-[calc(28px+(52-28)*((100vw-320px)/(1920-320)))] font-extrabold leading-[1.1] tracking-tight text-slate-900">{data.title || "Simple, Transparent Pricing"}</h2>
              <p className="mt-6 max-w-xl whitespace-pre-wrap text-[18px] leading-relaxed text-slate-500 [@media(max-width:1024px)]:mx-auto">{data.description || "Choose the perfect plan for your business size\nand needs. Upgrade or downgrade anytime."}</p>
            </div>
          </div>

          <div className="relative w-full overflow-hidden py-6 lg:hidden">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              centeredSlides={false}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                1024: { slidesPerView: 2, spaceBetween: 30 },
                1280: { slidesPerView: 3, spaceBetween: 30 },
              }}
              grabCursor={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="pricing-swiper pb-10! overflow-x-visible! overflow-y-visible!"
            >
              {plans.map((plan, idx) => (
                <SwiperSlide key={idx} className="h-auto! flex! max-w-76.5 flex-col!">
                  {renderPlanCard(plan, "mobile")}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className={`hidden w-full gap-5 lg:grid xl:gap-6 ${plans.length === 1 ? "lg:grid-cols-1" : plans.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
            {plans.map((plan, idx) => (
              <div key={idx} className="min-w-0">
                {renderPlanCard(plan, "desktop")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
