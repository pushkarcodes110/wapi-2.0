/* eslint-disable @next/next/no-img-element */
import { ImagePath } from "@/src/constants";
import { ImageProps } from "@/src/types/shared";
import { getResolvedImageUrl, isAbsoluteUrl } from "@/src/utils/image";
import Image from "next/image";
import { useState, useMemo, type CSSProperties, type FC, type ImgHTMLAttributes } from "react";

type NativeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

const Images: FC<ImageProps> = ({ src, fallbackSrc, alt, className = "", ...rest }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prevSrc, setPrevSrc] = useState<any>(null);

  const defaultPlaceholder = `${ImagePath}/default2.png`;

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

  if (isAbsoluteUrl(displaySrc)) {
    const nativeImageProps = { ...(rest as unknown as NativeImageProps) };
    const { fill, width, height, style } = nativeImageProps;
    delete nativeImageProps.fill;
    delete nativeImageProps.priority;
    delete nativeImageProps.unoptimized;
    delete nativeImageProps.width;
    delete nativeImageProps.height;
    delete nativeImageProps.style;

    const fillStyle: CSSProperties | undefined = fill
      ? { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent", ...style }
      : style;

    return (
      <img
        src={displaySrc}
        alt={alt || "image"}
        {...nativeImageProps}
        onError={handleError}
        className={className}
        width={fill ? undefined : width || 100}
        height={fill ? undefined : height || 100}
        style={fillStyle}
      />
    );
  }

  const { fill, width, height, ...nextImageProps } = rest;

  if (fill) {
    return <Image {...nextImageProps} src={displaySrc} alt={alt || "image"} onError={handleError} className={className} unoptimized={rest.unoptimized !== undefined ? rest.unoptimized : true} priority={rest.priority} fill />;
  }

  return <Image {...nextImageProps} src={displaySrc} alt={alt || "image"} onError={handleError} className={className} unoptimized={rest.unoptimized !== undefined ? rest.unoptimized : true} priority={rest.priority} width={width || 100} height={height || 100} />;
};

export default Images;
