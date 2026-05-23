"use client";

import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { cn } from "@/src/lib/utils";
import { useGetContactFunnelStatusQuery, useGetFunnelsQuery, useMoveFunnelItemMutation } from "@/src/redux/api/kanbanFunnelApi";
import { useAppSelector } from "@/src/redux/hooks";
import { KanbanFunnel, KanbanStage } from "@/src/types/kanban-funnel";
import { CheckCircle2, GitBranch, Loader2, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ProfilePipelineAssignProps {
  contactId: string;
}

interface ContactFunnelStatus {
  funnelId: string;
  funnelName: string;
  funnelType: string;
  stageId: string;
  stageName: string;
  priority: string;
  isArchived: boolean;
}

const getSortedStages = (pipeline?: KanbanFunnel): KanbanStage[] => {
  return [...(pipeline?.stages || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
};

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    return data?.message;
  }

  return undefined;
};

const ProfilePipelineAssign = ({ contactId }: ProfilePipelineAssignProps) => {
  const { t } = useTranslation();
  const { isCustom } = useChatTheme();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const [selectedPipelineId, setSelectedPipelineId] = useState<string | undefined>();
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();

  const { data: pipelinesResult, isLoading: isLoadingPipelines } = useGetFunnelsQuery({
    page: 1,
    limit: 100,
    funnelType: "contact",
    sort_by: "name",
    sort_order: "ASC",
  });
  const { data: statusResult, isLoading: isLoadingStatus, refetch: refetchStatus } = useGetContactFunnelStatusQuery(contactId, { skip: !contactId });
  const [moveFunnelItem, { isLoading: isAssigning }] = useMoveFunnelItemMutation();

  const pipelines = useMemo<KanbanFunnel[]>(() => pipelinesResult?.data || [], [pipelinesResult?.data]);
  const effectivePipelineId = selectedPipelineId || pipelines[0]?._id;
  const contactPipelineStatuses = useMemo<ContactFunnelStatus[]>(() => statusResult?.data || [], [statusResult?.data]);
  const activeContactPipelineStatuses = useMemo(() => contactPipelineStatuses.filter((status) => !status.isArchived), [contactPipelineStatuses]);
  const currentStatusForSelection = useMemo(() => activeContactPipelineStatuses.find((status) => String(status.funnelId) === String(effectivePipelineId)), [activeContactPipelineStatuses, effectivePipelineId]);
  const selectedPipeline = useMemo(() => pipelines.find((pipeline) => pipeline._id === effectivePipelineId), [pipelines, effectivePipelineId]);
  const stages = useMemo(() => getSortedStages(selectedPipeline), [selectedPipeline]);
  const effectiveStageId = selectedStageId || stages[0]?._id;

  const handlePipelineChange = (pipelineId: string) => {
    const nextPipeline = pipelines.find((pipeline) => pipeline._id === pipelineId);
    setSelectedPipelineId(pipelineId);
    setSelectedStageId(getSortedStages(nextPipeline)[0]?._id);
  };

  const handleAssignToPipeline = async () => {
    if (!effectivePipelineId || !effectiveStageId) {
      toast.error(t("select_pipeline_and_stage"));
      return;
    }

    try {
      await moveFunnelItem({
        id: effectivePipelineId,
        globalItemId: contactId,
        toStageId: effectiveStageId,
        position: 0,
      }).unwrap();
      await refetchStatus();
      toast.success(t("contact_added_to_pipeline_success"));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t("contact_added_to_pipeline_failed"));
    }
  };

  const isEmpty = !isLoadingPipelines && pipelines.length === 0;
  const hasNoStages = !!selectedPipeline && stages.length === 0;
  const isDisabled = isLoadingPipelines || isAssigning || isEmpty || hasNoStages || !effectivePipelineId || !effectiveStageId;
  const isAlreadyInSelectedPipeline = !!currentStatusForSelection;

  return (
    <div className="dark:border-none border-b border-gray-100 dark:bg-(--table-hover)! dark:border-(--card-border-color) p-5 space-y-4 mb-0" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="flex items-center justify-between gap-2 text-slate-900 dark:text-white font-semibold">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg shrink-0" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 90%)", color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}>
            <GitBranch size={18} />
          </div>
          <span className="truncate">{t("add_contact_to_pipeline")}</span>
        </div>
        <button
          onClick={() => window.open("/pipeline_board", "_blank")}
          className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded hover:bg-primary/10 transition-colors shrink-0"
        >
          {t("view_pipelines")}
        </button>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) p-4 text-center">
          <p className="text-xs text-slate-500 dark:text-gray-400">{t("no_contact_pipelines_found")}</p>
          <Button type="button" size="sm" onClick={() => window.open("/pipeline_board", "_blank")} className="mt-3 h-8 rounded-lg bg-primary text-white hover:bg-primary/90">
            <PlusCircle size={14} />
            {t("create_pipeline")}
          </Button>
        </div>
      ) : (
        <>
          <div className={cn("rounded-lg border p-3 text-xs", activeContactPipelineStatuses.length > 0 ? "border-primary/20 bg-primary/5 text-slate-700 dark:text-gray-200" : "border-dashed border-slate-200 bg-white/60 text-slate-500 dark:border-(--card-border-color) dark:bg-(--page-body-bg) dark:text-gray-400")}>
            {isLoadingStatus ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("loading_pipelines")}
              </span>
            ) : activeContactPipelineStatuses.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{t("contact_already_in_pipeline", "Contact is already in pipeline")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeContactPipelineStatuses.map((status) => (
                    <span key={`${status.funnelId}-${status.stageId}`} className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-700 shadow-sm ring-1 ring-primary/15 dark:bg-(--card-color) dark:text-gray-200">
                      {status.funnelName} · {status.stageName}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <span>{t("contact_not_in_pipeline_yet", "Contact isn't in pipeline yet. Add them below.")}</span>
            )}
          </div>

          <div className="space-y-1.5 relative">
            <Label className="text-[10px] font-medium text-slate-400 absolute -top-2 left-3 bg-white dark:bg-(--page-body-bg) px-1 z-10">{t("pipeline")}</Label>
            <Select value={effectivePipelineId} onValueChange={handlePipelineChange} disabled={isLoadingPipelines || isAssigning}>
              <SelectTrigger className="w-full h-11 py-7 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none border-gray-200 dark:hover:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus:ring-0">
                <SelectValue placeholder={isLoadingPipelines ? t("loading_pipelines") : t("select_pipeline")} />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline._id} value={pipeline._id} className="cursor-pointer dark:hover:bg-(--table-hover)">
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm">{pipeline.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {pipeline.stages?.length || 0} {t("stages")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 relative">
            <Label className="text-[10px] font-medium text-slate-400 absolute -top-2 left-3 bg-white dark:bg-(--page-body-bg) px-1 z-10">{t("stage")}</Label>
            <Select value={effectiveStageId} onValueChange={setSelectedStageId} disabled={isLoadingPipelines || isAssigning || stages.length === 0}>
              <SelectTrigger className="w-full h-11 py-7 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none border-gray-200 dark:hover:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus:ring-0">
                <SelectValue placeholder={hasNoStages ? t("no_stages_found") : t("select_stage")} />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                {stages.map((stage) => (
                  <SelectItem key={stage._id} value={stage._id as string} className="cursor-pointer dark:hover:bg-(--table-hover)">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color || "#cbd5e0" }} />
                      <span className="truncate">{stage.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleAssignToPipeline}
            disabled={isDisabled}
            className={cn("w-full h-10 rounded-lg bg-primary text-white hover:bg-primary/90", isCustom && "shadow-sm")}
          >
            {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle size={16} />}
            {isAlreadyInSelectedPipeline ? t("update_pipeline_stage", "Update Pipeline Stage") : t("add_to_pipeline")}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfilePipelineAssign;
