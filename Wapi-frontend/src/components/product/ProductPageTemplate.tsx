/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Images from "../../shared/Image";
import { FEATURESINFOLIST, PRODUCTINFOLIST } from "@/src/data";

export interface FeatureBlock {
  title: string;
  description: string;
  image: any;
  imageAlt: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProductPageTemplateProps {
  hero: {
    badge?: string;
    title: string;
    description: string;
    primaryCTA?: { text: string; link: string };
    secondaryCTA: { text: string; link: string };
    image: any;
  };
  features: FeatureBlock[];
  useCases: UseCase[];
  finalCTA: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const HeroSection: React.FC<ProductPageTemplateProps["hero"]> = ({ title, description, primaryCTA, secondaryCTA, image }) => {
  const router = useRouter();
  return (
    <section className="relative py-[calc(25px+(72-25)*((100vw-320px)/(1920-320)))] overflow-hidden bg-white">
      <div className="container mx-auto px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]">
        <div className="flex flex-col lg:flex-row items-center gap-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))]">
          <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left z-10">
            <div className="inline-block px-4 py-1.5 mb-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))] rounded-full bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500">Official WhatsApp API Partner</span>
            </div>
            <h1 className="text-[calc(18px+(41-18)*((100vw-320px)/(1920-320)))] font-black text-slate-900 leading-[1.05] mb-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] tracking-tight">{title}</h1>
            <p className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] text-slate-600 mb-[calc(16px+(42-16)*((100vw-320px)/(1920-320)))] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">{description}</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
              {primaryCTA && (
                <Button onClick={() => router.push(primaryCTA.link)} className="bg-primary text-white px-4.5 py-5 h-12 rounded-lg font-medium text-lg transition-all hover:scale-[1.02] active:scale-95">
                  {primaryCTA.text}
                </Button>
              )}
              <Button onClick={() => router.push(secondaryCTA.link)} variant="outline" className="border-2 border-black hover:bg-slate-50 text-black px-4.5 py-5 h-12 rounded-lg font-medium text-lg transition-all">
                {secondaryCTA.text}
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="flex-1 w-full lg:w-auto relative ">
            <Images src={image} alt="Wapi Product Interface" width={800} height={500} unoptimized className="w-full h-auto rounded-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC<{ features: FeatureBlock[] }> = ({ features }) => (
  <section className="py-[calc(25px+(72-25)*((100vw-320px)/(1920-320)))] bg-white">
    <div className="container mx-auto px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] flex flex-col gap-[calc(36px+(64-36)*((100vw-320px)/(1920-320)))]">
      {features.map((feature, idx) => (
        <div key={idx} className={`flex flex-col lg:flex-row items-center gap-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))] ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="flex-1">
            <div className="h-1 w-12 bg-primary mb-[calc(26px+(48-26)*((100vw-320px)/(1920-320)))] rounded-full" />
            <h2 className="text-[calc(21px+(41-22)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(18px+(32-18)*((100vw-320px)/(1920-320)))] leading-[1.1] tracking-tight">{feature.title}</h2>
            <p className="text-[calc(14px+(20-14)*((100vw-320px)/(1920-320)))] text-slate-600 mb-[calc(22px+(48-22)*((100vw-320px)/(1920-320)))] leading-relaxed font-normal">{feature.description}</p>
            <div className="space-y-5">
              {FEATURESINFOLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-900 mb-[calc(14px+(20-14)*((100vw-320px)/(1920-320)))] font-bold text-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="flex-1 w-full">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-slate-50 bg-white p-0">
              <Images src={feature.image} alt={feature.imageAlt} width={700} height={450} unoptimized className="w-full h-auto rounded-lg transition-transform duration-700" />
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  </section>
);

const UseCasesGrid: React.FC<{ useCases: UseCase[] }> = ({ useCases }) => (
  <section className="py-[calc(25px+(72-25)*((100vw-320px)/(1920-320)))] bg-slate-50">
    <div className="container mx-auto px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]">
      <div className="text-center max-w-4xl mx-auto mb-[calc(26px+(96-26)*((100vw-320px)/(1920-320)))]">
        <h2 className="text-[calc(21px+(41-21)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(12px+(20-12)*((100vw-320px)/(1920-320)))] tracking-tighter">Built for modern business</h2>
        <p className="text-[calc(14px+(20-14)*((100vw-320px)/(1920-320)))] text-slate-500 font-medium">Empower your team with a platform that scales with your ambition.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-[calc(24px+(40-24)*((100vw-320px)/(1920-320)))]">
        {useCases.map((useCase, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="bg-white p-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] rounded-lg border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 group h-full">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-5 transition-colors group-hover:bg-primary group-hover:text-white">{useCase.icon}</div>
            <h3 className="text-[calc(20px+(24-20)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 mb-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]">{useCase.title}</h3>
            <p className="text-md text-slate-500 leading-relaxed font-medium">{useCase.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({ hero, features, useCases }) => {
  return (
    <div className="flex flex-col bg-[var(--soft-white)]">
      <HeroSection {...hero} />

      <section className="py-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))] bg-white border-y border-slate-50">
        <div className="container mx-auto px-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))]">
          <div className="flex flex-wrap justify-between items-center gap-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))] opacity-50 max-w-5xl mx-auto grayscale">
            {PRODUCTINFOLIST.map((text, i) => (
              <span key={i} className="text-slate-500 font-medium text-sm ">
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection features={features} />
      <UseCasesGrid useCases={useCases} />
    </div>
  );
};

export default ProductPageTemplate;
