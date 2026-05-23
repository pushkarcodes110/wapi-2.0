"use client";

import React from "react";
import { sanitizeRichHtml } from "@/src/utils/richText";

interface PageContentProps {
  content: string;
}

const PageContent: React.FC<PageContentProps> = ({ content }) => {
  return (
    <div 
      className="dynamic-content max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }}
    />
  );
};

export default PageContent;
