/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AIModelForm from "@/src/components/ai_models/AIModelForm";
import { Button } from "@/src/elements/ui/button";
import { useGetModelByIdQuery, useUpdateModelMutation } from "@/src/redux/api/aiModelApi";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CreateAIModelRequest } from "@/src/types/store";
import { ROUTES } from "@/src/constants";

import { ArrowLeft } from "lucide-react";

const EditAIModelPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const modelName = params.modelName as string;

  const { data, isLoading: isFetching } = useGetModelByIdQuery(modelName);
  const [updateModel, { isLoading: isUpdating }] = useUpdateModelMutation();

  const handleSubmit = async (values: CreateAIModelRequest) => {
    try {
      await updateModel({ id: modelName, data: values }).unwrap();
      toast.success(t("ai_models_update_success"));
      router.push(ROUTES.AIModels);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("ai_models_update_error"));
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--text-green-primary)"></div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">{t("ai_models_no_models_found")}</p>
        <Button onClick={() => router.push(ROUTES.AIModels)} className="mt-4">
          {t("common_back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="sticky pt-0! top-[110px] z-[50] bg-light-body-bg shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] dark:bg-(--dark-body) py-4 -mt-4 transition-all mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">{t("ai_models_edit_title")}</h1>
          <p className="text-sm text-gray-400">{t("ai_models_edit_subtitle")}</p>
        </div>
      </div>
      <AIModelForm initialValues={data.data} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
};

export default EditAIModelPage;
