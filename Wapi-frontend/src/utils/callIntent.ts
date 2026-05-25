export const buildPhoneCallHref = (phoneNumber?: string | null) => {
  const digits = String(phoneNumber || "").replace(/\D/g, "");
  return digits ? `tel:${digits}` : "";
};
