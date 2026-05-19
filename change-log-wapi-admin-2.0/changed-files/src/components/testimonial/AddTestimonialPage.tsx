/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn, stripHtml } from "@/lib/utils";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import {
  useCreateTestimonialMutation,
  useGetTestimonialByIdQuery,
  useUpdateTestimonialMutation,
} from "@/src/redux/api/testimonialApi";
import CKEditorComponent from "@/src/shared/CkEditor";
import {
  ArrowLeft,
  Check,
  MessageSquare,
  Star,
  Upload,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";

interface AddTestimonialPageProps {
  id?: string;
}

const AddTestimonialPage = ({ id }: AddTestimonialPageProps) => {
  const { t } = useTranslation();
  const testimonialId = id;
  const isEditMode = !!testimonialId;

  const router = useRouter();
  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateTestimonialMutation();

  const { data: testimonialData, isLoading: isLoadingTestimonial } =
    useGetTestimonialByIdQuery(testimonialId || "", { skip: !testimonialId });

  const isLoading = isCreating || isUpdating || isLoadingTestimonial;

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientDesignation, setClientDesignation] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState(true);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (testimonialData?.data && isEditMode) {
      const testimonial = testimonialData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(testimonial.title || "");
      setClientName(testimonial.user_name || "");
      setClientDesignation(testimonial.user_post || "");
      setContent(testimonial.description || "");
      setRating(testimonial.rating || 5);
      setStatus(testimonial.status ?? true);

      if (testimonial.user_image) {
        setImagePreview(getResolvedImageUrl(testimonial.user_image));
      }
    }
  }, [testimonialData, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title || !clientName || !clientDesignation || !content) return;

    const plainContent = stripHtml(content);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("user_name", clientName);
    formData.append("user_post", clientDesignation);
    formData.append("description", plainContent);
    formData.append("rating", rating.toString());
    formData.append("status", status.toString());

    if (userImage) {
      formData.append("user_image", userImage);
    }

    try {
      if (isEditMode && testimonialId) {
        await updateTestimonial({ id: testimonialId, data: formData }).unwrap();
        toast.success(t("testimonial_success_updated"));
        setTimeout(() => {
          router.push(ROUTES.ManageTestimonials);
        }, 1000);
      } else {
        await createTestimonial(formData).unwrap();
        toast.success(t("testimonial_success_created"));

        setTimeout(() => {
          router.push(ROUTES.ManageTestimonials);
        }, 1000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t(isEditMode ? "testimonial.error_update" : "testimonial.error_create");
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
            {isEditMode
              ? t("testimonial_edit_title")
              : t("testimonial_add_title")}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isEditMode
              ? t("testimonial_edit_subtitle")
              : t("testimonial_add_subtitle")}
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Content — 8 columns */}
        <div className="xl:col-span-8 space-y-6">
          {/* User Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-300">
                {t("plan_basic_info")}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-6">
                {/* User Full Name */}
                <div className="space-y-2 flex flex-col mb-3">
                  <Label
                    htmlFor="client_name"
                    className="text-sm font-medium text-gray-900 dark:text-gray-400 mb-1"
                  >
                    {t("testimonial_labels_name")}
                  </Label>
                  <Input
                    id="client_name"
                    placeholder={t("testimonial_placeholders_name")}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color) p-3 border-gray-300 focus:border-(--text-green-primary) focus:ring-(--text-green-primary)"
                  />
                </div>

                {/* User Avatar */}
                <div className="space-y-2 lg:row-span-2 flex flex-col gap-2 mb-3">
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
                    Profile Image
                  </Label>
                  <div className="flex items-center gap-4 [@media(max-width:366px)]:flex-col [@media(max-width:366px)]:justify-center">
                    {/* Avatar Preview */}
                    <div className="shrink-0">
                      {imagePreview ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-(--card-border-color)">
                          <img
                            src={imagePreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) bg-gray-50 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label
                        htmlFor="user_image"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-amber-50 dark:hover:bg-(--dark-sidebar) border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </label>
                      <input
                        id="user_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                        <br />
                        Square aspect ratio recommended.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Designation/Organization */}
                <div className="space-y-2 flex flex-col">
                  <Label
                    htmlFor="client_designation"
                    className="text-sm font-medium text-gray-900 dark:text-gray-400 mb-1"
                  >
                    {t("testimonial_labels_position")}
                  </Label>
                  <Input
                    id="client_designation"
                    placeholder={t("testimonial_placeholders_position")}
                    value={clientDesignation}
                    onChange={(e) => setClientDesignation(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) p-3 border-gray-300 focus:border-(--text-green-primary) focus:ring-(--text-green-primary)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Content Card */}
          <div className="bg-white dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg shadow-sm border border-gray-200 sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-300">
                {t("testimonial_labels_feedback")}
              </h2>
            </div>

            <div className="space-y-4 mb-4 flex flex-col">
              <Label
                htmlFor="testimonial_title"
                className="text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                {t("inquiry_table_subject")}
              </Label>
              <Input
                id="testimonial_title"
                placeholder={t("testimonial_placeholders_name")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) border-gray-300 p-3 focus:border-(--text-green-primary) focus:ring-(--text-green-primary)"
              />
            </div>

            <div className="space-y-6">
              {/* Content Message */}
              <div className="space-y-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="content"
                    className="text-sm font-medium text-gray-900 dark:text-gray-400"
                  >
                    {t("testimonial_labels_feedback")}
                  </Label>
                  <span className="text-xs text-gray-500">
                    0 / 400 characters
                  </span>
                </div>
                <div className="border border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg overflow-hidden focus-within:border-(--text-green-primary) focus-within:ring-1 focus-within:ring-(--text-green-primary) transition-all bg-gray-50">
                  <CKEditorComponent
                    value={content}
                    onChange={setContent}
                    placeholder={t("testimonial_placeholders_feedback")}
                    minHeight="150px"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  {t("testimonial_labels_rating")}
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-all hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-5 h-5 transition-colors",
                          star <= rating
                            ? "fill-(--warning-color) text-(--warning-color)"
                            : "fill-gray-200 text-gray-200",
                        )}
                      />
                    </div>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-200">
                    ({rating}.0 {t("testimonial_labels_rating")})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — 4 columns */}
        <div className="xl:col-span-4 space-y-6">
          {/* Settings Card */}
          <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="sm:px-6 px-4 py-4 border-b border-gray-100 dark:border-(--card-border-color)">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("common_settings")}
              </h2>
            </div>
            <div className="sm:p-6 p-4 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    {t("faq_publish_label")}
                  </Label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {t("testimonial_publish_description")}
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={status}
                  onCheckedChange={setStatus}
                  className="data-[state=checked]:bg-(--text-green-primary)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end flex-wrap gap-3 mt-8">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="px-6 py-5 h-11 border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-gray-200 shadow-sm dark:hover:bg-(--dark-sidebar) text-gray-700 hover:bg-gray-50 font-medium"
          disabled={isLoading}
        >
          {t("common_cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 py-5 h-11 bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          disabled={
            isLoading ||
            !title ||
            !clientName ||
            !clientDesignation ||
            !content ||
            isLoadingTestimonial
          }
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isLoading
            ? isEditMode
              ? t("common_updating")
              : t("common_creating")
            : isEditMode
              ? t("testimonial_edit_title")
              : t("testimonial_add_title")}
        </Button>
      </div>
    </div>
  );
};

export default AddTestimonialPage;
