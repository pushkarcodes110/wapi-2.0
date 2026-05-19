"use client";

import { PaymentGatewayHeaderProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

const PaymentGatewayHeader = ({ isLoading }: PaymentGatewayHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <CommonHeader
        title={t("gateway_title")}
        description={t("gateway_description")}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PaymentGatewayHeader;
