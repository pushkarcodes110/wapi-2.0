"use client";

import { Button } from "@/src/elements/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Sub-components
import PageContentForm from "./forms/PageContentForm";
import SEOSettingsForm from "./forms/SEOSettingsForm";
import MetaImageForm from "./forms/MetaImageForm";
import VisibilitySettingsForm from "./forms/VisibilitySettingsForm";

interface PageFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

const PageForm = ({ initialData, onSubmit, isLoading, isEdit }: PageFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const RESERVED_SLUGS = ["terms-and-conditions", "privacy-policy", "refund-policy"];
  const isReservedSlug = (slug: string) => RESERVED_SLUGS.includes(slug);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    status: true,
  });

  const [metaImage, setMetaImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: initialData.title || "",
        slug: initialData.slug || "",
        content: initialData.content || "",
        meta_title: initialData.meta_title || "",
        meta_description: initialData.meta_description || "",
        status: initialData.status ?? true,
      });
      if (initialData.meta_image) {
        setImagePreview(initialData.meta_image);
      }
    }
  }, [initialData]);

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isReserved = isReservedSlug(form.slug);

    setForm((prev) => ({
      ...prev,
      title: value,
      slug: isReserved ? prev.slug : generateSlug(value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("common_error_image_too_large", "Image size should be less than 2MB"));
        return;
      }
      setMetaImage(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setMetaImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error(t("pages_error_title_required", "Title is required"));
      return;
    }
    if (!form.content) {
      toast.error(t("pages_error_content_required", "Content is required"));
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("content", form.content);
    formData.append("meta_title", form.meta_title);
    formData.append("meta_description", form.meta_description);
    formData.append("status", String(form.status));

    if (metaImage) {
      formData.append("meta_image", metaImage);
    } else if (imagePreview && !imagePreview.startsWith("blob:")) {
    }

    await onSubmit(formData);
  };

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="sticky top-[100px] z-[50] -mx-4 pt-0! sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-light-body-bg dark:bg-(--dark-body) shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] py-4 mb-5 sm:mb-2 flex flex-col sm:flex-row sm:items-center gap-4 transition-all">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-(--text-green-primary) tracking-tight">
            {isEdit ? t("pages_edit_title", "Edit Page") : t("pages_add_title", "Create New Page")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm leading-relaxed">
            {isEdit ? t("pages_subtitle") : t("pages_add_subtitle", "Fill in the details below to create a new page")}
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Content — 8 columns */}
        <div className="xl:col-span-8 space-y-6">
          <PageContentForm
            title={form.title}
            slug={form.slug}
            content={form.content}
            onTitleChange={handleTitleChange}
            onContentChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
          />

          <SEOSettingsForm
            metaTitle={form.meta_title}
            metaDescription={form.meta_description}
            onMetaTitleChange={(e) => setForm((prev) => ({ ...prev, meta_title: e.target.value }))}
            onMetaDescriptionChange={(e) => setForm((prev) => ({ ...prev, meta_description: e.target.value }))}
          />
        </div>

        {/* Sidebar — 4 columns */}
        <div className="xl:col-span-4 space-y-6">
          <VisibilitySettingsForm
            status={form.status}
            onStatusChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
          />

          <MetaImageForm
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />
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
          {t("common_cancel")}
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !form.title}
          className="px-6 py-5 h-11 bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check size={18} />
          )}
          {isLoading
            ? isEdit ? t("common_updating") : t("common_saving")
            : isEdit ? t("common_update") : t("common_save")}
        </Button>
      </div>
    </div>
  );
};

export default PageForm;
