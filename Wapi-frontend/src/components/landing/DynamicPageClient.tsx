"use client";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/src/components/landing/Header";
import Footer from "@/src/components/landing/Footer";
import PageContent from "@/src/components/landing/PageContent";
import { useAppDispatch } from "@/src/redux/hooks";
import { setPageTitle, setPageDescription } from "@/src/redux/reducers/settingSlice";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";
import { useGetLandingPageQuery } from "@/src/redux/api/landingPageApi";
import Loading from "@/src/app/loading";

interface DynamicPageClientProps {
  slug: string;
}

const DynamicPageClient: React.FC<DynamicPageClientProps> = ({ slug }) => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  const { data: pageData, isLoading: isPageLoading, error } = useGetPublicPageBySlugQuery(slug);
  const { data: landingData } = useGetLandingPageQuery();

  useEffect(() => {
    if (pageData?.data) {
      dispatch(setPageTitle(pageData.data.title));
      dispatch(setPageDescription(pageData.data.meta_description || ""));
    }
    return () => {
      dispatch(setPageTitle(""));
      dispatch(setPageDescription(""));
    };
  }, [pageData, dispatch]);

  useEffect(() => {
    const previousTheme = theme;
    setTheme("light");
    return () => {
      if (previousTheme) {
        setTheme(previousTheme);
      }
    };
  }, [setTheme, theme]);

  if (isPageLoading) {
    return <Loading />;
  }

  if (error || !pageData?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-(--card-page-color) text-white">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400">The page you are looking for does not exist or has been removed.</p>
        <a href="/" className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Back to Home
        </a>
      </div>
    );
  }

  const page = pageData.data;
  const footerData = landingData?.data?.footer_section;

  return (
    <div className="min-h-screen bg-(--card-bg-color)">
      <Header isColor={true} />

      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-[calc(20px+(243-20)*((100vw-320px)/(1920-320)))]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-9">
            <h1 className="text-3xl font-extrabold text-[var(--landing-theme-dark)] mb-4">{page.title}</h1>
          </div>

          <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm border border-gray-100">
            <PageContent content={page.content} />
          </div>
        </div>
      </main>

      {footerData && <Footer data={footerData} />}
    </div>
  );
};

export default DynamicPageClient;
