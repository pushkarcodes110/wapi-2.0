import DynamicPageClient from "@/src/components/landing/DynamicPageClient";
import { Metadata } from "next";
import { store } from "@/src/redux/store";
import { pageApi } from "@/src/redux/api/pageApi";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";
const DEFAULT_OG_IMAGE = "/assets/logos/app.png";

const resolveUrl = (url?: string): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STORAGE_URL}${url}`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await store.dispatch(pageApi.endpoints.getPublicPageBySlug.initiate(slug));
    const page = result.data?.data;

    if (!page) {
      return {
        title: "Page Not Found | Synqzy",
      };
    }

    const title = page.title;
    const description = page.meta_description || "Synqzy Dynamic Page";
    const image = resolveUrl(page.meta_image) || DEFAULT_OG_IMAGE;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: "Synqzy",
        images: [{ url: image }],
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "Synqzy",
    };
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DynamicPageClient slug={slug} />;
}
