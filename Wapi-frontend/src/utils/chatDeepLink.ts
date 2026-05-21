export interface ChatDeepLink {
  phone: string;
  text: string;
  key: string;
}

export const normalizeChatPhone = (value?: string | null) => {
  if (!value) return "";
  return decodeURIComponent(value).split("?")[0].replace(/\D/g, "");
};

export const getChatDeepLink = (searchParams: URLSearchParams): ChatDeepLink | null => {
  const rawPhone = searchParams.get("phone") || searchParams.get("to") || "";
  const phone = normalizeChatPhone(rawPhone);
  if (!phone) return null;

  const inlineText = rawPhone.includes("?") ? rawPhone.split("?").slice(1).join("?") : "";
  const text = searchParams.get("text") || searchParams.get("message") || searchParams.get("body") || inlineText || "hello";
  const decodedText = decodeURIComponent(text.replace(/\+/g, " ")).trim() || "hello";

  return {
    phone,
    text: decodedText,
    key: `${phone}:${decodedText}`,
  };
};
