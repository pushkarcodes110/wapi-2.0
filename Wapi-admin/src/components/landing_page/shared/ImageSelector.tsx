"use client";

import { useState } from "react";
import { ImageIcon, Pencil, Upload, Image as ImageLucide } from "lucide-react";
import MediaUploadModal from "./MediaUploadModal";
import Images from "@/src/shared/Image";

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

const ImageSelector = ({ label, value, onChange, placeholder = "Select Image", className = "" }: ImageSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1 mb-1.5 block">{label}</label>}

      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer border border-dashed border-gray-200 dark:border-(--card-border-color) bg-gray-50/50 dark:bg-page-body rounded-xl p-3 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <div className="relative w-16 h-16 rounded-lg bg-white dark:bg-(--card-color) border border-gray-100 dark:border-none shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
          {value ? (
            <Images src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 opacity-20">
              <ImageLucide className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-8">
          <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-0.5 truncate uppercase tracking-tighter">
            {value ? "Update Media" : placeholder}
          </p>
          <p className="text-[13px] text-gray-400 truncate font-medium break-all">
            {value ? value : "High quality images recommended"}
          </p>
        </div>

        {/* Edit/Upload Icon at Top Right */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white dark:bg-(--card-color) border border-gray-100 dark:border-(--card-border-color) flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-all shadow-sm">
          {value ? <Pencil className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
        </div>
      </div>

      <MediaUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={onChange} title={`Upload ${label || "Media"}`} />
    </div>
  );
};

export default ImageSelector;
