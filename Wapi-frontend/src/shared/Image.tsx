/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ImagePath, ROUTES } from "@/src/constants";
import { ImageProps } from "@/src/types/shared";
import { getResolvedImageUrl, isAbsoluteUrl } from "@/src/utils/image";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, type FC } from "react";

const Images: FC<ImageProps> = ({ src, fallbackSrc, alt, className = "", ...rest }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [prevSrc, setPrevSrc] = useState<any>(null);
  const pathname = usePathname();
  const isLanding = pathname.match(ROUTES.Landing);

  const defaultPlaceholder = isLanding ? `${ImagePath}/default3.png` : `${ImagePath}/default3.png`;

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const resolveImageSource = useMemo(() => {
    return getResolvedImageUrl(src, fallbackSrc);
  }, [src, fallbackSrc]);

  const displaySrc = useMemo(() => {
    if (hasError) {
      return fallbackSrc || defaultPlaceholder;
    }
    return resolveImageSource;
  }, [hasError, resolveImageSource, fallbackSrc, defaultPlaceholder]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const imageProps = {
    src: displaySrc,
    alt: alt || "image",
    onError: handleError,
    className: `${className}${hasError ? "" : ""}`,
    unoptimized: rest.unoptimized !== undefined ? rest.unoptimized : true,
    priority: rest.priority,
    ...rest,
  };

  if (rest.fill) {
    delete (imageProps as any).width;
    delete (imageProps as any).height;
  } else {
    imageProps.width = rest.width || 100;
    imageProps.height = rest.height || 100;
  }

  if (isAbsoluteUrl(displaySrc)) {
    const nativeImageProps = { ...(rest as any) };
    const { fill, width, height } = nativeImageProps;
    delete nativeImageProps.fill;
    delete nativeImageProps.priority;
    delete nativeImageProps.unoptimized;
    delete nativeImageProps.width;
    delete nativeImageProps.height;

    const fillStyle = fill
      ? { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }
      : undefined;

    return (
      <img
        {...nativeImageProps}
        src={displaySrc}
        alt={alt || "image"}
        onError={handleError}
        className={className}
        width={fill ? undefined : width || 100}
        height={fill ? undefined : height || 100}
        style={fillStyle}
      />
    );
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...(imageProps as any)} />;
};

export default Images;
