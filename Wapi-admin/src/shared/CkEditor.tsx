"use client";

import { Button } from "@/src/elements/ui/button";
import { CKEditorComponentProps } from "@/src/types/shared";
import { Bold, Code, Italic, Link, List, ListOrdered, Quote, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from "react";

type EditorCommand = "bold" | "italic" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList" | "formatBlock" | "createLink" | "removeFormat" | "undo" | "redo";

type ToolbarButton = {
  command: EditorCommand;
  icon: ElementType;
  label: string;
  value?: string;
};

const toolbarButtons: ToolbarButton[] = [
  { command: "undo", icon: Undo2, label: "Undo" },
  { command: "redo", icon: Redo2, label: "Redo" },
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  { command: "insertUnorderedList", icon: List, label: "Bulleted list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { command: "formatBlock", icon: Quote, label: "Quote", value: "blockquote" },
  { command: "formatBlock", icon: Code, label: "Code block", value: "pre" },
];

const normalizeHtml = (html: string) => html || "";

const CKEditorComponent = ({ value, onChange, onReady, placeholder = "Type your answer here...", minHeight = "160px" }: CKEditorComponentProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(normalizeHtml(value));
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  const emitChange = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    const html = editorElement.innerHTML;
    lastValueRef.current = html;
    setIsEmpty(editorElement.innerText.trim() === "" && html.replace(/<br\s*\/?>/gi, "").trim() === "");
    onChange(html);
  }, [onChange]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const applyCommand = (command: EditorCommand, commandValue?: string) => {
    focusEditor();

    if (command === "createLink") {
      const url = window.prompt("Enter URL");
      if (!url) return;
      document.execCommand(command, false, url);
      emitChange();
      return;
    }

    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const compatibleEditor = useMemo(() => {
    return {
      getData: () => editorRef.current?.innerHTML || "",
      setData: (html: string) => {
        const nextHtml = normalizeHtml(html);
        if (editorRef.current && editorRef.current.innerHTML !== nextHtml) {
          editorRef.current.innerHTML = nextHtml;
        }
        lastValueRef.current = nextHtml;
        setIsEmpty(!nextHtml || nextHtml.replace(/<[^>]*>/g, "").trim() === "");
        onChange(nextHtml);
      },
      model: {
        document: {
          selection: {
            getFirstPosition: () => null,
          },
        },
        change: (callback: (writer: { insertText: (text: string) => void }) => void) => {
          focusEditor();
          callback({
            insertText: (text: string) => {
              document.execCommand("insertText", false, text);
            },
          });
          emitChange();
        },
      },
    };
  }, [emitChange, onChange]);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    const nextValue = normalizeHtml(value);
    if (nextValue === lastValueRef.current || editorElement.innerHTML === nextValue) return;

    editorElement.innerHTML = nextValue;
    lastValueRef.current = nextValue;
    setIsEmpty(!nextValue || nextValue.replace(/<[^>]*>/g, "").trim() === "");
  }, [value]);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    const initialValue = normalizeHtml(value);
    editorElement.innerHTML = initialValue;
    lastValueRef.current = initialValue;
    setIsEmpty(!initialValue || initialValue.replace(/<[^>]*>/g, "").trim() === "");
    onReady?.(compatibleEditor);
    // onReady is intentionally called once for the editor instance lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white dark:bg-page-body">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-(--input-color) p-2 dark:border-(--card-border-color) dark:bg-(--card-color)">
        {toolbarButtons.map(({ command, icon: Icon, label, value: commandValue }) => (
          <Button
            key={`${command}-${commandValue || label}`}
            type="button"
            variant="ghost"
            size="icon"
            title={label}
            aria-label={label}
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand(command, commandValue);
            }}
            className="h-8 w-8 rounded-md text-gray-500 hover:bg-white hover:text-primary dark:text-gray-300 dark:hover:bg-(--dark-sidebar)"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Link"
          aria-label="Link"
          onMouseDown={(event) => {
            event.preventDefault();
            applyCommand("createLink");
          }}
          className="h-8 w-8 rounded-md text-gray-500 hover:bg-white hover:text-primary dark:text-gray-300 dark:hover:bg-(--dark-sidebar)"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        {isEmpty && !isFocused && (
          <div className="pointer-events-none absolute left-4 top-4 text-sm text-gray-400 dark:text-gray-500">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={() => {
            setIsFocused(false);
            emitChange();
          }}
          onFocus={() => setIsFocused(true)}
          className="rich-text-editor min-h-25 w-full overflow-y-auto break-words bg-white p-4 text-sm leading-relaxed text-gray-900 outline-none dark:bg-page-body dark:text-gray-100 [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:rounded-md [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:font-mono [&_ul]:list-disc [&_ul]:pl-6"
          style={{ minHeight, maxHeight: "400px" }}
        />
      </div>
    </div>
  );
};

export default CKEditorComponent;
