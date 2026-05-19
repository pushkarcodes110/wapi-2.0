/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card } from "@/src/elements/ui/card";
import { cn } from "@/src/lib/utils";
import { useCreateCampaignMutation } from "@/src/redux/api/campaignApi";
import { useGetTemplateQuery } from "@/src/redux/api/templateApi";
import { chatApi } from "@/src/redux/api/chatApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import WabaRequired from "@/src/shared/WabaRequired";
import { CampaignFormValues } from "@/src/types/components";
import { useFormik } from "formik";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import StepBasicInfo from "./StepBasicInfo";
import StepRecipients from "./StepRecipients";
import StepScheduling from "./StepScheduling";
import StepVariablesMapping from "./StepVariablesMapping";
import StepWhatsAppConfig from "./StepWhatsAppConfig";
import { ROUTES } from "@/src/constants";
import {
  getTemplateVariables,
  isMarketingTemplate,
} from "@/src/utils/template";

const ALL_STEPS = [
  {
    id: "basic",
    title: "General Information",
    description: "Name and internal description",
  },
  {
    id: "config",
    title: "WhatsApp Settings",
    description: "Select WABA & Template",
  },
  {
    id: "variables",
    title: "Data Mapping",
    description: "Dynamic content mapping",
  },
  { id: "recipients", title: "Audience", description: "Target audience" },
  { id: "schedule", title: "Timeline", description: "Timing and Launch" },
];

const DIRECT_STEPS = [
  {
    id: "config",
    title: "WhatsApp Config",
    description: "WABA & Template Selection",
  },
  {
    id: "variables",
    title: "Data Mapping",
    description: "Dynamic content mapping",
  },
  { id: "schedule", title: "Timeline", description: "Review and Launch" },
];

const CampaignWizard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactId = searchParams.get("contact_id");
  const isDirectMode = !!contactId;

  const STEPS = isDirectMode ? DIRECT_STEPS : ALL_STEPS;

  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const [createCampaign, { isLoading: isCreating }] =
    useCreateCampaignMutation();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id || "";

  const formik = useFormik<CampaignFormValues>({
    initialValues: {
      name: isDirectMode
        ? `Direct Message - ${new Date().toLocaleString()}`
        : "",
      description: "",
      waba_id: wabaIdFromWorkspace,
      template_id: "",
      variables_mapping: {},
      recipient_type: isDirectMode ? "specific_contacts" : "all_contacts",
      specific_contacts: isDirectMode && contactId ? [contactId] : [],
      tag_ids: [],
      segment_ids: [],
      media_url: "",
      is_scheduled: false,
      scheduled_at: "",
      coupon_code: "",
      offer_expiration_minutes: "",
      thumbnail_product_retailer_id: "",
      carousel_cards_data: [],
      carousel_products: [],
    },
    onSubmit: async (values) => {
      try {
        const payload: any = { ...values };

        if (payload.recipient_type === "all_contacts") {
          payload.specific_contacts = [];
          payload.tag_ids = [];
          payload.segment_ids = [];
        } else if (payload.recipient_type === "specific_contacts") {
          payload.tag_ids = [];
          payload.segment_ids = [];
        } else if (payload.recipient_type === "tags") {
          payload.specific_contacts = [];
          payload.segment_ids = [];
        } else if (payload.recipient_type === "segments") {
          payload.specific_contacts = [];
          payload.tag_ids = [];
        }

        // Sanitize variables_mapping keys (remove stringified objects)
        if (payload.variables_mapping) {
          const cleanMapping: Record<any, any> = {};
          Object.entries(payload.variables_mapping).forEach(([key, value]) => {
            if (!key.startsWith("{") && !key.includes('"key":')) {
              cleanMapping[key] = value;
            }
          });
          payload.variables_mapping = cleanMapping;
        }

        // Remove empty optional template-specific fields to keep the payload clean
        if (!payload.coupon_code) delete payload.coupon_code;
        if (!payload.offer_expiration_minutes)
          delete payload.offer_expiration_minutes;
        if (!payload.thumbnail_product_retailer_id)
          delete payload.thumbnail_product_retailer_id;
        if (!payload.carousel_cards_data?.length)
          delete payload.carousel_cards_data;
        if (!payload.carousel_products?.length)
          delete payload.carousel_products;
        if (!payload.media_url) delete payload.media_url;
        if (
          !payload.variables_mapping ||
          !Object.keys(payload.variables_mapping).length
        )
          delete payload.variables_mapping;

        // Check for local carousel files
        const carouselHasLocalFiles = (
          values.carousel_cards_data as any[]
        )?.some((card) => card.header?.localFile);

        let finalPayload: any;
        if (carouselHasLocalFiles) {
          const formData = new FormData();

          // Prepare a clean version of carousel_cards_data for JSON stringification
          const cleanCarouselCardsData = (
            payload.carousel_cards_data as any[]
          )?.map((card: any) => {
            if (card.header?.localFile) {
              const { localFile, ...headerWithoutFile } = card.header;
              return {
                ...card,
                header: {
                  ...headerWithoutFile,
                  link: "{{LOCAL_FILE}}", // Placeholder for backend mapping
                },
              };
            }
            return card;
          });

          const sanitizedPayload = {
            ...payload,
            carousel_cards_data: cleanCarouselCardsData,
          };

          // Append all keys except complex ones
          Object.entries(sanitizedPayload).forEach(([key, value]) => {
            if (
              key === "carousel_cards_data" ||
              key === "carousel_products" ||
              key === "variables_mapping" ||
              key === "specific_contacts" ||
              key === "tag_ids" ||
              key === "segment_ids"
            ) {
              formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });

          // Append local files in order
          values.carousel_cards_data?.forEach((card) => {
            if (card.header?.localFile) {
              formData.append("carousel_files", card.header.localFile);
            }
          });
          finalPayload = formData;
        } else {
          finalPayload = payload;
        }

        const response = await createCampaign(finalPayload).unwrap();
        if (response.success) {
          toast.success("Campaign created successfully!");
          if (isDirectMode) {
            dispatch(chatApi.util.invalidateTags(["Messages", "Chats"]));
          }
        } else {
          toast.error("Campaign created failed!");
        }

        const redirectTo = searchParams.get("redirect_to");
        if (redirectTo) {
          router.push(redirectTo);
        } else if (isDirectMode) {
          router.push(ROUTES.WAChat);
        } else {
          router.push(ROUTES.MessageCampaigns);
        }
      } catch (error: any) {
        toast.error(error?.data?.error || "Failed to create campaign");
      }
    },
  });

  const { data: templateResult } = useGetTemplateQuery(
    formik.values.template_id,
    {
      skip: !formik.values.template_id,
    },
  );
  const template = templateResult?.data;

  if (!wabaIdFromWorkspace) {
    return (
      <WabaRequired
        title="WABA Connection Required"
        description="To create and send campaigns, you first need to connect a WhatsApp Business Account (WABA) to this workspace."
      />
    );
  }

  const nextStep = () => {
    const error = validateCurrentStep(currentStep);
    if (error) {
      toast.error(error);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateCurrentStep = (stepIdx: number) => {
    if (!isDirectMode && stepIdx === 0 && !formik.values.name)
      return "Please enter a campaign name";
    const configStepIndex = isDirectMode ? 0 : 1;
    if (
      stepIdx === configStepIndex &&
      (!formik.values.waba_id || !formik.values.template_id)
    )
      return "Please select WABA and Template";

    const variablesStepIndex = isDirectMode ? 1 : 2;
    if (stepIdx === variablesStepIndex && template) {
      const vars = getTemplateVariables(template);
      for (const v of vars) {
        if (!formik.values.variables_mapping?.[v])
          return `Variable {{${v}}} is required`;
      }
      if (isMarketingTemplate(template) && !formik.values.coupon_code)
        return "Coupon code is required";
    }

    const recipientsStepIndex = isDirectMode ? -1 : 3;
    if (stepIdx === recipientsStepIndex) {
      if (
        formik.values.recipient_type === "specific_contacts" &&
        (!formik.values.specific_contacts ||
          formik.values.specific_contacts.length === 0)
      ) {
        return "Please select at least one contact";
      }
      if (
        formik.values.recipient_type === "tags" &&
        (!formik.values.tag_ids || formik.values.tag_ids.length === 0)
      ) {
        return "Please select at least one tag";
      }
      if (
        formik.values.recipient_type === "segments" &&
        (!formik.values.segment_ids || formik.values.segment_ids.length === 0)
      ) {
        return "Please select at least one segment";
      }
    }

    return null;
  };

  const handleStepClick = (index: number) => {
    if (index === currentStep) return;

    if (index < currentStep) {
      setCurrentStep(index);
      return;
    }

    // Validate forward jumps
    for (let i = currentStep; i < index; i++) {
      const error = validateCurrentStep(i);
      if (error) {
        toast.error(error);
        return;
      }
    }
    setCurrentStep(index);
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className=" mx-auto space-y-8 sm:p-8 p-4 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <div className="flex md:flex-row md:items-center gap-6 pb-6 border-b dark:border-(--card-border-color)">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {t("create_campaign")}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Follow the steps to launch your campaign.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 [@media(min-width:1427px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1427px)]:col-span-3 space-y-4 custom-scrollbar [@media(max-width:1426px)]:flex [@media(max-width:1426px)]:snap-x [@media(max-width:1426px)]:snap-mandatory [@media(max-width:1426px)]:overflow-x-auto">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex items-start gap-4 p-4 [@media(max-width:1426px)]:min-w-70 rounded-lg transition-all duration-300 mb-4 cursor-pointer group",
                  isActive
                    ? "bg-white dark:bg-(--card-color) shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-(--card-border-color)"
                    : "opacity-60 hover:opacity-100",
                )}
                onClick={() => handleStepClick(index)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold transition-all",
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20"
                        : "bg-slate-100 dark:bg-(--dark-sidebar) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
                  )}
                >
                  {isCompleted ? <Check size={20} /> : index + 1}
                </div>
                <div className="min-w-0">
                  <h3
                    className={cn(
                      "font-black text-sm uppercase tracking-wider line-clamp-1 transition-colors",
                      isActive
                        ? "text-primary dark:text-white"
                        : "text-slate-500 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-slate-200",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="[@media(min-width:1427px)]:col-span-9">
          <Card className="sm:p-6 p-4 pb-0 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-white/50 dark:bg-(--card-color) backdrop-blur-xl shadow-md shadow-slate-200/20">
            <div className="min-h-100">
              {(isDirectMode ? currentStep === -1 : currentStep === 0) && (
                <StepBasicInfo formik={formik} />
              )}
              {(isDirectMode ? currentStep === 0 : currentStep === 1) && (
                <StepWhatsAppConfig formik={formik} />
              )}
              {(isDirectMode ? currentStep === 1 : currentStep === 2) && (
                <StepVariablesMapping formik={formik} />
              )}
              {(isDirectMode ? currentStep === -1 : currentStep === 3) && (
                <StepRecipients formik={formik} />
              )}
              {(isDirectMode ? currentStep === 2 : currentStep === 4) && (
                <StepScheduling formik={formik} />
              )}
            </div>

            <div className="mt-12 p-5 flex-wrap gap-3 border-t dark:border-(--card-border-color) flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 rounded-lg bg-gray-200 dark:hover:bg-(--table-hover) h-12 px-4.5! py-5 dark:bg-(--dark-sidebar) font-bold hover:bg-slate-100"
              >
                <ChevronLeft size={20} /> Back
              </Button>

              {isLastStep ? (
                <Button
                  onClick={() => formik.handleSubmit()}
                  disabled={isCreating}
                  className="gap-2 rounded-lg h-12 px-8 font-bold dark:text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isCreating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={20} /> Launch Campaign
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="gap-2 rounded-lg h-12 px-4.5! py-5 font-bold dark:text-white bg-primary hover:bg-primary  dark:hover:bg-primary/90"
                >
                  Next Step <ChevronRight size={20} />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;
