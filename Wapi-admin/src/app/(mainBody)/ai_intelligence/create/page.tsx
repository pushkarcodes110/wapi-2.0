/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AIModelForm from "@/src/components/ai_models/AIModelForm";
import { useCreateModelMutation } from "@/src/redux/api/aiModelApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CreateAIModelRequest } from "@/src/types/store";
import { ROUTES } from "@/src/constants";

import { Button } from "@/src/elements/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateAIModelPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [createModel, { isLoading }] = useCreateModelMutation();

  const handleSubmit = async (values: CreateAIModelRequest) => {
    try {
      await createModel(values).unwrap();
      toast.success(t("ai_models_create_success"));
      router.push(ROUTES.AIModels);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("ai_models_create_error"));
    }
  };

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="sticky pt-0! top-[110px] z-[50]  bg-light-body-bg shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] dark:bg-(--dark-body) py-4 -mt-4 transition-all mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold mb-2 text-(--text-green-primary)">{t("ai_models_create_title")}</h1>
          <p className="text-sm text-gray-400">{t("ai_models_add_subtitle")}</p>
        </div>
      </div>
      <AIModelForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateAIModelPage;
