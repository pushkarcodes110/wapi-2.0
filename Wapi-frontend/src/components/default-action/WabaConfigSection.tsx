/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { useGetWabaConfigurationQuery, useUpdateWabaConfigurationMutation } from "@/src/redux/api/wabaConfigurationApi";
import { WabaConfigPayload, ReplyRef, DelayedReplyRef } from "@/src/types/wabaConfiguration";
import ConfigRow from "./waba-config/ConfigRow";
import ToggleSwitch from "./waba-config/ToggleSwitch";
import { cn } from "@/src/lib/utils";
import { ToggleConfigFieldProps, WabaConfigSectionProps } from "@/src/types/defaultAction";

const CONFIG_FIELDS: ToggleConfigFieldProps[] = [
  {
    key: "out_of_working_hours",
    label: "Outside business hours",
    description:
      "Auto-reply sent when a message is received beyond working hours",
  },
  {
    key: "welcome_message",
    label: "Greeting message",
    description: "Initial message sent to a new contact",
  },
  {
    key: "delayed_reply",
    label: "Postponed Response",
    description: "Message sent after a set delay if no agent responds",
    hasDelayMinutes: true,
  },
  {
    key: "fallback_message",
    label: "Default fallback message",
    description: "Sent when no matching keyword or action is found",
  },
  {
    key: "reengagement_message",
    label: "Reactivation message",
    description:
      "Sent to reconnect with inactive contacts after a period of inactivity",
  },
];

const WabaConfigSection: React.FC<WabaConfigSectionProps> = ({ wabaId }) => {
  const [localConfig, setLocalConfig] = useState<WabaConfigPayload>({});
  const [initialConfig, setInitialConfig] = useState<WabaConfigPayload>({});
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const initializedWabaId = useRef<string | null>(null);

  const hasChanges = JSON.stringify(localConfig) !== JSON.stringify(initialConfig);

  const { data, isLoading, isError } = useGetWabaConfigurationQuery(wabaId, { skip: !wabaId });
  const [updateConfig, { isLoading: isSaving }] = useUpdateWabaConfigurationMutation();

  useEffect(() => {
    if (data?.data && initializedWabaId.current !== wabaId) {
      const d = data.data;
      const config = {
        out_of_working_hours: d.out_of_working_hours ?? null,
        welcome_message: d.welcome_message ?? null,
        delayed_reply: d.delayed_reply ?? null,
        fallback_message: d.fallback_message ?? null,
        reengagement_message: d.reengagement_message ?? null,
        round_robin_assignment: d.round_robin_assignment ?? false,
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalConfig(config);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialConfig(config);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabledMap({
        out_of_working_hours: !!d.out_of_working_hours?.id,
        welcome_message: !!d.welcome_message?.id,
        delayed_reply: !!d.delayed_reply?.id,
        fallback_message: !!d.fallback_message?.id,
        reengagement_message: !!d.reengagement_message?.id,
      });
      initializedWabaId.current = wabaId;
    }
  }, [data, wabaId]);


  const saveConfig = useCallback(
    async (newConfig: WabaConfigPayload) => {
      try {
        const response = await updateConfig({ wabaId, data: newConfig }).unwrap();
        toast.success(response.message || "Configuration saved");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to save configuration");
      }
    },
    [wabaId, updateConfig]
  );

  const handleToggle = (key: string, enabled: boolean) => {
    setEnabledMap((prev) => ({ ...prev, [key]: enabled }));
    if (!enabled) {
      setLocalConfig((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleReplyChange = (key: keyof WabaConfigPayload, ref: ReplyRef | null) => {
    setLocalConfig((prev) => ({ ...prev, [key]: ref }));
  };

  const handleDelayChange = (minutes: number) => {
    const current = localConfig.delayed_reply as DelayedReplyRef | null;
    const newRef: DelayedReplyRef | null = current ? { ...current, delay_minutes: minutes } : { id: "", type: "", delay_minutes: minutes };
    setLocalConfig((prev) => ({ ...prev, delayed_reply: newRef }));
  };

  const handleRoundRobin = (v: boolean) => {
    setLocalConfig((prev) => ({ ...prev, round_robin_assignment: v }));
  };

  const handleSave = () => {
    saveConfig(localConfig);
    setInitialConfig(localConfig);
  };

  const handleDiscard = () => {
    setLocalConfig(initialConfig);
    setEnabledMap({
      out_of_working_hours: !!initialConfig.out_of_working_hours,
      welcome_message: !!initialConfig.welcome_message,
      delayed_reply: !!initialConfig.delayed_reply,
      fallback_message: !!initialConfig.fallback_message,
      reengagement_message: !!initialConfig.reengagement_message,
    });
    toast.info("Changes discarded");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-slate-400">
        <Info size={28} />
        <p className="text-sm">Could not load configuration. Please refresh.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {CONFIG_FIELDS.filter((_, i) => i % 2 === 0).map((field) => (
              <ConfigRow
                key={field.key}
                field={field}
                value={localConfig[field.key] as any}
                enabled={!!enabledMap[field.key]}
                isExpanded={!!enabledMap[field.key]}
                isSaving={isSaving}
                wabaId={wabaId}
                onToggle={(v) => handleToggle(field.key, v)}
                onReplyChange={(ref) => handleReplyChange(field.key, ref)}
                onDelayChange={
                  field.hasDelayMinutes ? handleDelayChange : undefined
                }
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {CONFIG_FIELDS.filter((_, i) => i % 2 !== 0).map((field) => (
              <ConfigRow
                key={field.key}
                field={field}
                value={localConfig[field.key] as any}
                enabled={!!enabledMap[field.key]}
                isExpanded={!!enabledMap[field.key]}
                isSaving={isSaving}
                wabaId={wabaId}
                onToggle={(v) => handleToggle(field.key, v)}
                onReplyChange={(ref) => handleReplyChange(field.key, ref)}
                onDelayChange={
                  field.hasDelayMinutes ? handleDelayChange : undefined
                }
              />
            ))}
            <div className="rounded-lg border border-slate-100 dark:border-(--card-border-color)/50 bg-white dark:bg-(--card-color) shadow-sm">
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-(--dark-body) text-slate-400">
                    <Loader2
                      size={15}
                      className={cn(
                        localConfig.round_robin_assignment &&
                        "text-primary animate-pulse",
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        localConfig.round_robin_assignment
                          ? "text-slate-800 dark:text-white"
                          : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      Sequential assignment
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                      Automatically assign incoming chats to agents in rotation
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={!!localConfig.round_robin_assignment}
                  onChange={handleRoundRobin}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Floating Bar */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white dark:bg-(--card-color) p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col pr-4 border-r border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-800 dark:text-white">Unsaved Changes</span>
            <span className="text-xs text-slate-400">You have unsaved configuration updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-4 h-10 rounded-lg"
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-6 h-10 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WabaConfigSection;
