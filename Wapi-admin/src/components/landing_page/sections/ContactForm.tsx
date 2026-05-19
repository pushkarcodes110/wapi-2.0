/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Switch } from "@/src/elements/ui/switch";
import { ContactSection } from "@/src/types/landingPage";
import { Phone, Mail, MessageSquare } from "lucide-react";

interface ContactFormProps {
  data: ContactSection;
  onChange: (data: ContactSection) => void;
}

const ContactForm = ({ data, onChange }: ContactFormProps) => {
  const handleChange = (field: keyof ContactSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1421px)]:col-span-7 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2.5 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Section Title</Label>
              <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="e.g. Get in Touch" className="bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
            </div>
            <div className="space-y-2.5 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Support Tagline</Label>
              <Input value={data.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} placeholder="e.g. We're here to help you grow" className="bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) h-12 text-[15px]" />
            </div>
            <div className="space-y-2.5 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Narrative (Optional)</Label>
              <Textarea value={data.description || ""} onChange={(e) => handleChange("description", e.target.value)} placeholder="Provide some additional context for your visitors..." rows={4} className="bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) resize-none text-[15px] leading-relaxed p-4" />
            </div>
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-5 space-y-6 md:space-y-8">
          <div className="p-4 sm:p-6 border border-primary/10 dark:border-primary/5 rounded-lg bg-primary/[0.02] dark:bg-primary/[0.01] space-y-6 md:space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              <Label className="text-[13px] font-medium text-primary">Direct Contact Points</Label>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-gray-400">
                  <Phone className="w-3.5 h-3.5" />
                  <Label className="text-[13px] font-medium">Business Phone</Label>
                </div>
                <Input
                  type="tel"
                  value={data.phone_no}
                  onChange={(e) => handleChange("phone_no", e.target.value.replace(/[a-zA-Z]/g, ""))}
                  placeholder="+1 234 567 890"
                  className="bg-(--input-color) dark:bg-page-body h-11 text-[14px] border-(--input-border-color) dark:border-none shadow-sm rounded-lg px-5"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1 text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  <Label className="text-[13px] font-medium">Corporate Email</Label>
                </div>
                <Input value={data.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="contact@example.com" className="bg-(--input-color) dark:bg-page-body h-11 text-[14px] border-(--input-border-color) dark:border-none shadow-sm rounded-lg px-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 md:p-6 bg-white dark:bg-(--dark-body) flex-wrap border border-gray-100 dark:border-(--card-border-color) rounded-lg shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <Label className="text-[14px] font-bold block truncate">Interactive Form</Label>
                <p className="text-[11px] text-gray-400 font-medium truncate">Allow visitors to send messages</p>
              </div>
            </div>
            <Switch checked={data.form_enabled} onCheckedChange={(checked) => handleChange("form_enabled", checked)} className="data-[state=checked]:bg-primary scale-100 md:scale-110 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
