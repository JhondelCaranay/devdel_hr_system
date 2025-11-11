import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isHtmlEmpty(html: string): boolean {
  // Create a DOM parser
  const parser = new DOMParser();
  // Parse the HTML string into a document
  const doc = parser.parseFromString(html, "text/html");
  // Get the text content (ignores tags)
  const text = doc.body.textContent?.trim() || "";
  // Return true if there's no text
  return text.length === 0;

  /* 
    // If there's visible text, not empty
    if (text.length > 0) return false;

    // If there's at least one media or embedded tag, not empty
    const nonTextElements = doc.body.querySelector("img, video, iframe, audio, object");
    return !nonTextElements;
  */
}
