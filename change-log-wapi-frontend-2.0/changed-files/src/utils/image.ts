/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageBaseUrl, ImagePath } from "@/src/constants";

export const isAbsoluteUrl = (url: string): boolean => {
  return /^(https?:|data:|\/\/|blob:)/i.test(url);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getResolvedImageUrl = (src: any, fallbackSrc?: string): string => {
  const defaultPlaceholder = `${ImagePath}/default3.png`;

  if (!src) {
    return fallbackSrc || defaultPlaceholder;
  }

  try {
    let sourceString: string;

    if (typeof src === "string") {
      sourceString = src.trim();
    }
    else if (typeof src === "object" && src !== null) {
      sourceString = (src.src || src.url || "").trim();
    }
    else {
      sourceString = String(src).trim();
    }

    if (!sourceString) {
      return fallbackSrc || defaultPlaceholder;
    }

    if (isAbsoluteUrl(sourceString)) {
      return sourceString;
    }

    if (sourceString.startsWith("/assets/")) {
      return sourceString;
    }

    if (sourceString.startsWith(ImagePath)) {
      return sourceString;
    }

    if (sourceString.startsWith("/_next/")) {
      return sourceString;
    }

    const baseUrl = (ImageBaseUrl || "").endsWith("/") ? ImageBaseUrl : `${ImageBaseUrl}/`;

    if (sourceString.startsWith("/uploads/")) {
      return `${baseUrl}${sourceString.substring(1)}`;
    }

    if (sourceString.startsWith("./")) {
      return `${baseUrl}${sourceString.replace("./", "")}`;
    }

    if (sourceString.startsWith("/images/")) {
      return `/assets${sourceString}`;
    }

    if (sourceString.startsWith("/")) {
      return `${ImagePath}${sourceString}`;
    }

    if (!sourceString.includes("/") && sourceString.includes(".")) {
      return `${baseUrl}${sourceString}`;
    }

    return sourceString.includes("/") ? `${baseUrl}${sourceString.replace(/^\//, "")}` : `${ImagePath}/${sourceString}`;
  } catch (error) {
    console.error("Error resolving image source:", error);
    return fallbackSrc || defaultPlaceholder;
  }
};
