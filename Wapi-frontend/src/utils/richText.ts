const ALLOWED_TAGS_PATTERN = /<(?!\/?(?:p|br|b|strong|i|em|u|s|strike|ul|ol|li|blockquote|pre|code|a|h1|h2|h3|h4|h5|h6)\b)[^>]*>/gi;

const decodeHtmlEntities = (html: string) => {
  return html
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&");
};

export const sanitizeRichHtml = (html: string = "") => {
  if (!html) return "";

  let sanitized = decodeHtmlEntities(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s(?:data-[\w-]+|class|style|id|role|aria-[\w-]+|contenteditable|spellcheck|lang|dir|start|end)=("[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/<span\b[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .replace(/<(\/?)div\b[^>]*>/gi, "<$1p>")
    .replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, "");

  sanitized = sanitized.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const href = attrs.match(/\shref=("[^"]*"|'[^']*'|[^\s>]*)/i)?.[1];
    return href ? `<a href=${href}>` : "<a>";
  });

  return sanitized.replace(ALLOWED_TAGS_PATTERN, "").replace(/&nbsp;/gi, " ").trim();
};
