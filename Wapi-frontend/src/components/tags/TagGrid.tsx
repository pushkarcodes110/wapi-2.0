"use client";

import { Tag } from "@/src/types/components";
import TagCard from "./TagCard";
import { Pagination } from "@/src/shared/Pagination";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Loader2, Tag as TagIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TagGridProps {
  tags: Tag[];
  isLoading: boolean;
  isFetching: boolean;
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const TagGrid = ({
  tags,
  isLoading,
  isFetching,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  emptyMessage = "No tags found.",
}: TagGridProps) => {
  const currentPageIds = tags.map((tag) => tag._id);
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-white dark:bg-(--card-color) rounded-xl border border-dashed border-slate-200 dark:border-(--card-border-color)">
        <div className="p-4 bg-primary/10 rounded-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading tags...</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-white dark:bg-(--card-color) rounded-xl border border-dashed border-slate-200 dark:border-(--card-border-color)">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full">
          <TagIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-base font-medium text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid Containter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6  ">
        {tags.map((tag) => (
          <TagCard
            key={tag._id}
            tag={tag}
            isSelected={selectedIds.includes(tag._id)}
            onSelect={handleSelectRow}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Container */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow overflow-hidden mt-8">
        <Pagination
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          isLoading={isLoading || isFetching}
          total={totalCount}
          className="border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default TagGrid;
