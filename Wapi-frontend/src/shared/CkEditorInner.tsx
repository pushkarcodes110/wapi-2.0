/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ALL ckeditor5 imports live here so this file is only ever loaded
// via next/dynamic({ ssr: false }), guaranteeing a single evaluation.
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Strikethrough,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useRef } from "react";

const PLUGINS = [Essentials, Paragraph, Bold, Italic, Strikethrough, Link, List, Heading, BlockQuote, Code, CodeBlock];

const TOOLBAR = ["undo", "redo", "|", "heading", "|", "bold", "italic", "strikethrough", "|", "link", "|", "bulletedList", "numberedList", "|", "blockQuote", "code", "codeBlock"];

const CUSTOM_STYLE_ID = "ckeditor-custom-styles";

const injectStyles = () => {
  if (document.getElementById(CUSTOM_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = CUSTOM_STYLE_ID;
  style.textContent = `
    .ck.ck-editor__editable_inline {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      white-space: normal !important;
      max-width: 100% !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .ck.ck-editor__editable_inline p,
    .ck.ck-editor__editable_inline div {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      white-space: normal !important;
    }
    .ck.ck-editor {
      width: 100% !important;
      max-width: 100% !important;
    }
    .ck.ck-editor__main {
      width: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
    }
    .ck-editor__editable {
      min-height: 100px !important;
      max-height: 100px !important;
    }
    .ck-placeholder {
      margin-block: 0px !important;
    }
    .ck-editor__editable_inline {
      min-height: 100px !important;
      max-height: 100px !important;
    }
    // .ck-editor__editable_inline.ck-focused {
    //   min-height: 100% !important;
    //   max-height: 100% !important;
    // }
    .ck-editor__editable_inline.ck-focused .ck-placeholder {
      margin-block: 14px !important;
    }
    .ck-loader {
      min-height: 100px !important;
      max-height: 100px !important;
    }
    .dark .ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
      border: none !important;
    }
    .dark .ck.ck-editor__main:focus-visible {
      outline: none !important;
    }
    .dark .ck.ck-sticky-panel__content {
      border: none !important;
    }
    .dark .ck.ck-toolbar {
      background-color: var(--table-hover) !important;
      border-color: var(--card-border-color) !important;
    }
    .dark .ck.ck-toolbar .ck-button {
      color: rgb(226 232 240) !important;
    }
    .dark .ck.ck-toolbar .ck-button:hover {
      background-color: var(--dark-sidebar) !important;
    }
    .dark .ck.ck-toolbar .ck-button.ck-on {
      background-color: var(--table-hover) !important;
      color: var(--text-green-primary) !important;
    }
    .dark .ck.ck-content {
      background-color: var(--table-hover) !important;
      color: rgb(226 232 240) !important;
    }
    .dark .ck.ck-editor__editable_inline {
      background-color: var(--table-hover) !important;
      color: rgb(226 232 240) !important;
    }
    .dark .ck.ck-toolbar .ck-toolbar__separator {
      background-color: var(--card-border-color) !important;
    }
    .dark .ck.ck-balloon-panel {
      background: var(--table-hover) !important;
    }
  `;
  document.head.appendChild(style);
};

const CKEditorInner = ({ value, onChange, onReady, placeholder = "Type your message here...", minHeight = "160px" }: any) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div ref={editorRef} style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }} className="rounded-lg overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          placeholder,
          plugins: PLUGINS,
          toolbar: TOOLBAR,
        }}
        onReady={(editorInstance: any) => {
          if (onReady) onReady(editorInstance);
          const editorElement = editorInstance.ui?.view?.element;
          if (editorElement) {
            const toolbar = editorElement.querySelector(".ck-toolbar");
            if (toolbar instanceof HTMLElement) {
              toolbar.style.backgroundColor = "transparent";
              toolbar.style.border = "none";
              toolbar.style.borderBottom = "1px solid var(--gray-100)";
              toolbar.style.padding = "4px 8px";
            }
            const content = editorElement.querySelector(".ck-content");
            if (content instanceof HTMLElement) {
              content.style.minHeight = minHeight;
              content.style.maxHeight = "400px";
              content.style.border = "none";
              content.style.padding = "12px 16px";
              content.style.fontSize = "14px";
              content.style.lineHeight = "1.6";
              content.style.backgroundColor = "transparent";
            }
          }
        }}
        onChange={(_event: any, editorInstance: any) => {
          const data = editorInstance.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorInner;
