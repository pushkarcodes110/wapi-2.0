/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useCreateLanguageMutation, useGetLanguageByIdQuery, useUpdateLanguageMutation } from "@/src/redux/api/languageApi";
import { AlertCircle, ArrowLeft, Check, Download, FileJson, Globe, Languages, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { languages } from "@/src/utils/languages";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_JSON_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

interface AddLanguagePageProps {
  id?: string;
}

const AddLanguagePage = ({ id }: AddLanguagePageProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
  const { data: languageData, isLoading: isLoadingLanguage } = useGetLanguageByIdQuery(id || "", { skip: !isEditMode });

  const [name, setName] = useState("");
  const [locale, setLocale] = useState("");
  const [isRtl, setIsRtl] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string | null>(null);

  const [frontJsonFile, setFrontJsonFile] = useState<File | null>(null);
  const [frontJsonFileName, setFrontJsonFileName] = useState<string | null>(null);

  const [adminJsonFile, setAdminJsonFile] = useState<File | null>(null);
  const [adminJsonFileName, setAdminJsonFileName] = useState<string | null>(null);

  const [appJsonFile, setAppJsonFile] = useState<File | null>(null);
  const [appJsonFileName, setAppJsonFileName] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && languageData?.data) {
      const lang = languageData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(lang.name);
      setLocale(lang.locale);
      setIsRtl(lang.is_rtl);
      setIsActive(lang.is_active);
      setIsDefault(lang.is_default || false);
      if (lang.flag) {
        setFlagPreview(getResolvedImageUrl(lang.flag));
      }
    }
  }, [isEditMode, languageData]);

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid image format. Use PNG, JPG, SVG or WEBP.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size too large. Max 2MB allowed.");
        return;
      }
      setFlagFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlagPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "admin" | "app") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        toast.error("Please upload a valid JSON file.");
        return;
      }
      if (file.size > MAX_JSON_SIZE) {
        toast.error("JSON file too large. Max 5MB allowed.");
        return;
      }

      if (type === "front") {
        setFrontJsonFile(file);
        setFrontJsonFileName(file.name);
      } else if (type === "admin") {
        setAdminJsonFile(file);
        setAdminJsonFileName(file.name);
      } else if (type === "app") {
        setAppJsonFile(file);
        setAppJsonFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !locale) {
      toast.error("Name and Locale are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("locale", locale);
    formData.append("is_rtl", String(isRtl));
    formData.append("is_active", String(isActive));

    if (flagFile) {
      formData.append("flag", flagFile);
    }
    if (frontJsonFile) {
      formData.append("front_translation_file", frontJsonFile);
    }
    if (adminJsonFile) {
      formData.append("admin_translation_file", adminJsonFile);
    }
    if (appJsonFile) {
      formData.append("app_translation_file", appJsonFile);
    }
    formData.append("is_default", String(isDefault));

    try {
      if (isEditMode) {
        await updateLanguage({ id: id as string, data: formData }).unwrap();
        toast.success("Language updated successfully.");
      } else {
        await createLanguage(formData).unwrap();
        toast.success("Language created successfully.");
      }
      router.push(ROUTES.Languages);
    } catch (error: any) {
      toast.error(error?.data?.error || error?.error || "Something went wrong.");
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingLanguage;

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="sticky top-[100px] z-[50] -mx-4 pt-0! sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-light-body-bg dark:bg-(--dark-body) shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] py-4 mb-5 sm:mb-2 flex flex-col sm:flex-row sm:items-center gap-4 transition-all">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-(--text-green-primary) tracking-tight">
            {isEditMode ? "Edit Language" : "Add New Language"}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isEditMode
              ? "Update language details and translation files."
              : "Set up a new language and upload localization files."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Sidebar — 4 columns: Basic Information */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-300">Basic Information</h2>
              </div>

              <div className="space-y-6">
                {/* Choose Language */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="locale" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Choose Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={locale}
                    onValueChange={(val) => {
                      setLocale(val);
                      const selectedLang = languages.find((l) => l.code === val);
                      const isSystemName = languages.some((l) => l.name === name);
                      if (!name || isSystemName) {
                        if (selectedLang) setName(selectedLang.name);
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 dark:bg-(--card-color)">
                      {languages.map((lang) => (
                        <SelectItem className="max-h-64 dark:hover:bg-(--table-hover)" key={lang.code} value={lang.code}>
                          {lang.name} ({lang.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Name */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. English"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg"
                    required
                  />
                </div>

                {/* Status Toggles */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all">
                  <div>
                    <Label htmlFor="isRtl" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      Right-to-Left (RTL)
                    </Label>
                    <p className="text-xs text-gray-500">Enable for scripts like Arabic or Hebrew</p>
                  </div>
                  <Switch id="isRtl" checked={isRtl} onCheckedChange={setIsRtl} className="data-[state=checked]:bg-(--text-green-primary)" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all">
                  <div>
                    <Label htmlFor="isActive" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      Active Status
                    </Label>
                    <p className="text-xs text-gray-500">Enable this language for users</p>
                  </div>
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-(--text-green-primary)" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-none transition-all">
                  <div>
                    <Label htmlFor="isDefault" className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      Set as Default
                    </Label>
                    <p className="text-xs text-gray-500">Make this the primary language for the platform</p>
                  </div>
                  <Switch id="isDefault" checked={isDefault} onCheckedChange={setIsDefault} className="data-[state=checked]:bg-(--text-green-primary)" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content — 8 columns: Translations & Assets */}
          <div className="xl:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Languages className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-300">Translations & Assets</h2>
              </div>

              <div className="space-y-8">
                {/* Flag Picker */}
                <div className="space-y-4 flex flex-col">
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Flag Icon</Label>
                  <div className="flex items-center gap-6 flex-col sm:flex-row">
                    <div className="shrink-0">
                      {flagPreview ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 group shadow-sm transition-all hover:border-emerald-500">
                          <Image src={flagPreview} alt="Flag" className="w-full h-full object-cover" width={100} height={100} unoptimized />
                          <button
                            type="button"
                            onClick={() => {
                              setFlagFile(null);
                              setFlagPreview(null);
                            }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 dark:border-(--card-border-color) bg-gray-50 dark:bg-(--card-color) flex flex-col items-center justify-center transition-all hover:border-emerald-500">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label htmlFor="flag" className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-page-body dark:border-none dark:text-slate-300 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-(--table-hover) transition-all font-medium text-sm text-gray-700 shadow-sm active:scale-95">
                        <Upload className="w-4 h-4" />
                        {flagPreview ? "Change Flag Icon" : "Upload Flag Icon"}
                      </label>
                      <input id="flag" type="file" accept="image/*" onChange={handleFlagChange} className="hidden" />
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        PNG, SVG, WEBP. Max 2MB. Square ratio best.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Translation JSON Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Front JSON */}
                  <div className="space-y-4 flex flex-col">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Synqzy Front JSON</Label>
                    <div className="relative border-2 border-dashed border-gray-200 dark:border-(--card-border-color) rounded-lg p-6 bg-gray-50/50 dark:bg-(--card-color) hover:bg-gray-100/50 dark:hover:bg-(--table-hover) hover:border-(--text-green-primary) transition-all group overflow-hidden">
                      <input id="front_json" type="file" accept=".json,application/json" onChange={(e) => handleJsonChange(e, "front")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <FileJson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {frontJsonFileName ? (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{frontJsonFileName}</p>
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block">Selected</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Front JSON</p>
                            <p className="text-[10px] text-gray-500">Drop file or click</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <a href="/assets/files/Front.json" download="Front.json" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors w-fit">
                      <Download className="w-3 h-3" />
                      Download Front JSON
                    </a>
                  </div>

                  {/* Admin JSON */}
                  <div className="space-y-4 flex flex-col">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Synqzy Admin JSON</Label>
                    <div className="relative border-2 border-dashed border-gray-200 dark:border-(--card-border-color) rounded-lg p-6 bg-gray-50/50 dark:bg-(--card-color) hover:bg-gray-100/50 dark:hover:bg-(--table-hover) hover:border-(--text-green-primary) transition-all group overflow-hidden">
                      <input id="admin_json" type="file" accept=".json,application/json" onChange={(e) => handleJsonChange(e, "admin")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <FileJson className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        {adminJsonFileName ? (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{adminJsonFileName}</p>
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block">Selected</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Admin JSON</p>
                            <p className="text-[10px] text-gray-500">Drop file or click</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <a href="/assets/files/Admin.json" download="Admin.json" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors w-fit">
                      <Download className="w-3 h-3" />
                      Download Admin JSON
                    </a>
                  </div>

                  {/* App JSON */}
                  <div className="space-y-4 flex flex-col">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">Synqzy App JSON</Label>
                    <div className="relative border-2 border-dashed border-gray-200 dark:border-(--card-border-color) rounded-lg p-6 bg-gray-50/50 dark:bg-(--card-color) hover:bg-gray-100/50 dark:hover:bg-(--table-hover) hover:border-(--text-green-primary) transition-all group overflow-hidden">
                      <input id="app_json" type="file" accept=".json,application/json" onChange={(e) => handleJsonChange(e, "app")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <FileJson className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        {appJsonFileName ? (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{appJsonFileName}</p>
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block">Selected</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">App JSON</p>
                            <p className="text-[10px] text-gray-500">Drop file or click</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <a href="/assets/files/App.json" download="App.json" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors w-fit">
                      <Download className="w-3 h-3" />
                      Download App JSON
                    </a>
                  </div>
                </div>

                {/* Note for Edit Mode */}
                {isEditMode && !frontJsonFile && !adminJsonFile && !appJsonFile && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">Existing translation files remain active unless you upload new ones.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end flex-wrap gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 py-5 h-11 border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-gray-200 shadow-sm dark:hover:bg-(--dark-sidebar) text-gray-700 hover:bg-gray-50 font-medium"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-5 h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 gap-2 min-w-40"
            disabled={isLoading || !name || !locale}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-5 h-5 text-white" />
            )}
            {isLoading
              ? isEditMode ? "Saving..." : "Creating..."
              : isEditMode ? "Save Changes" : "Create Language"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLanguagePage;
