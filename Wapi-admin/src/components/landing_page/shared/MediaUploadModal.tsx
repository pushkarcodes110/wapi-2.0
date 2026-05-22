/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { X, Upload, Check, ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { toast } from "sonner";
import { useUploadLandingImageMutation } from "@/src/redux/api/landingPageApi";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

const MediaUploadModal = ({ isOpen, onClose, onSelect, title = "Upload Media" }: MediaUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadLandingImage, { isLoading }] = useUploadLandingImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUseUrl = () => {
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    onSelect(trimmedUrl);
    onClose();
    setImageUrl("");
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadLandingImage(formData).unwrap();
      if (response.success) {
        toast.success("Image uploaded successfully");
        onSelect(response.imageUrl);
        onClose();
        setFile(null);
        setPreview(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0! overflow-hidden border-none rounded-xl dark:bg-(--card-color)">
        <DialogHeader className="px-6 py-4 border-b dark:border-(--card-border-color) bg-gray-50 dark:bg-(--dark-body)">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8">
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all
                ${preview ? "border-primary bg-primary/5" : "border-gray-200 dark:border-(--card-border-color) hover:border-primary hover:bg-primary/5"}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100 dark:border-none shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 border-t border-gray-100 dark:border-(--card-border-color)" />
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-(--card-color) px-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">or use image URL</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-500 dark:text-gray-400">Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUseUrl()}
                    placeholder="https://example.com/image.png"
                    className="h-11 pl-9 bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) text-sm"
                  />
                </div>
                <Button type="button" onClick={handleUseUrl} disabled={!imageUrl.trim()} className="h-11 px-4 bg-primary hover:bg-primary/90 text-white">
                  Use URL
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t dark:border-(--card-border-color) bg-gray-50 dark:bg-(--dark-body) flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color)"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirm & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
