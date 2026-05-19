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
import Image from "next/image";
import CurrencyValue from "@/src/shared/CurrencyValue";

const PricingPlan: React.FC<PricingPlanProps> = ({ data }) => {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const plans = (data.plans || [])
    .map((p) => {
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
        priceSuffix: `/per ${planDoc.billing_cycle}`,
        features: formattedFeatures,
        isPopular: planDoc.name.toLowerCase() === "pro",
        is_featured: planDoc.is_featured,
      };
    })
    .filter(Boolean);

  if (plans.length === 3) {
    const featuredIdx = plans.findIndex((p) => p && p.is_featured);
    if (featuredIdx !== -1 && featuredIdx !== 1) {
      const featured = plans[featuredIdx];
      plans.splice(featuredIdx, 1);
      plans.splice(1, 0, featured);
    }
  }

  return (
    <section id="pricing" className="bg-[linear-gradient(180deg,var(--features-bg-start)_0%,var(--background)_100%)] py-[calc(60px+(140-60)*((100vw-320px)/(1920-320)))] pb-0" style={{ overflowX: "clip" }}>
      <div className="mx-[calc(16px+(195-16)*((100vw-320px)/(1920-320)))]">
        <div className="grid grid-cols-1 gap-[calc(30px+(60-30)*((100vw-320px)/(1920-320)))] lg:grid-cols-[1.2fr_2.5fr] lg:items-center">
          <div className="flex flex-col gap-[calc(20px+(40-20)*((100vw-320px)/(1920-320)))]">
            <div className="[@media(max-width:1024px)]:text-center">
              <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">{data.badge || "Pricing Plan"}</span>
              <h2 className="mt-4 text-[calc(28px+(56-28)*((100vw-320px)/(1920-320)))] font-extrabold leading-[1.1] tracking-tight text-slate-900 whitespace-pre-wrap  line-clamp-2">{data.title || "Simple, Transparent Pricing"}</h2>
              <p className="mt-6 text-[18px] leading-relaxed text-slate-500 whitespace-pre-wrap">{data.description || "Choose the perfect plan for your business size\nand needs. Upgrade or downgrade anytime."}</p>
            </div>

            <div className="flex items-center gap-4 mt-4 [@media(max-width:1024px)]:justify-center">
              <div className="flex -space-x-3 transition-all duration-300">
                {[...Array(5)].map((i, index) => (
                  <div key={index} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm hover:scale-110 hover:z-10 transition-transform">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" width={100} height={100} unoptimized />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-900 leading-tight">4.9/5 Rated</p>
                <p className="text-[12px] text-slate-500">Over {data.subscribed_count || "9.2k"} Customers</p>
              </div>
            </div>
          </div>

          <div className="relative w-full py-6 overflow-hidden">
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
              {plans.map((plan, idx) => {
                return (
                  <SwiperSlide key={idx} className="h-auto! flex! max-w-76.5 flex-col!">
                    <div className={`relative flex flex-col flex-1 rounded-[35px] transition-all duration-500 ${plan!.is_featured ? "bg-primary p-1  z-10" : "bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"}`} style={plan!.is_featured ? { transform: "translateY(-8px)" } : {}}>
                      {plan!.is_featured && (
                        <div className="py-3 text-center">
                          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">Most Popular Plan</span>
                        </div>
                      )}

                      <div className={`flex flex-col flex-1 p-[calc(20px+(28-20)*((100vw-320px)/(1920-320)))] ${plan!.is_featured ? "bg-white rounded-[32px]" : ""}`}>
                        <div className="mb-6">
                          <h3 className="text-[22px] font-bold text-slate-900">{plan!.name}</h3>
                          <p className="mt-1.5 text-[14px] text-slate-500 font-medium opacity-80">{plan!.description}</p>
                          <div className="mt-5 flex items-baseline gap-1.5">
                            <CurrencyValue amount={plan!.price} fromCode={plan!.currencyCode?.code} className="text-[calc(28px+(39-28)*((100vw-320px)/(1920-320)))] font-extrabold text-slate-900 tracking-tight" fallbackSymbol={plan!.currencyCode === "INR" ? "₹" : "$"} />
                            <span className="text-[15px] text-slate-500 font-medium">{plan!.priceSuffix === "/per undefined" ? "/per user" : plan!.priceSuffix}</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3.5 mb-8">
                          {plan!.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-3">
                              <BadgeCheck size={18} className="text-primary shrink-0 opacity-80" />
                              <p className="text-[14px] text-slate-600">
                                <span className="text-slate-500 opacity-90">{feature.label}: </span>
                                <span className="font-bold text-slate-800 ml-1">{feature.value}</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto space-y-3">
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                router.push(user?.role === "agent" ? ROUTES.WAChat : ROUTES.BillingPlans);
                              } else {
                                router.push(ROUTES.Login);
                              }
                            }}
                            className={`w-full rounded-xl py-3 px-3 text-[15px] font-bold transition-all duration-300 ${plan!.is_featured ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-[var(--primary-hover)]" : "bg-primary text-white hover:bg-[var(--primary-hover)]"}`}
                          >
                            Choose Plan
                          </button>
                          {plan!.is_featured && (
                            <p className="text-center text-[13px] text-slate-500 font-medium">
                              or{" "}
                              <a href="#" className="text-slate-900 font-bold hover:text-primary transition-colors border-b border-slate-900/20 hover:border-primary">
                                contact sales
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
