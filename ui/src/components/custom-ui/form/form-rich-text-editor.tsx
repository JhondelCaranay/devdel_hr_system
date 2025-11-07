/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions/placeholder";
import TextAlign from "@tiptap/extension-text-align";
// import Typography from "@tiptap/extension-typography";

// shadcn / lucide imports (adjust paths to match your project)
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Link as LinkIcon,
  // Image as ImageIcon,
  Type as TypeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

interface FormRichTextProps {
  control: any; // react-hook-form control
  name: string;
  label?: string;
  placeholder?: string;
}

function useTiptapEditor({
  content = "",
  placeholder = "Start typing...",
  onUpdate,
}: {
  content?: string;
  placeholder?: string;
  onUpdate?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: true,
      }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  return editor;
}

export function RichTextToolbar({ editor }: { editor: Editor | null }) {
  const [url, seturl] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!editor) return null;

  const insertImageFile = async (file: File) => {
    // Default behavior: convert to base64 and insert
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    editor.chain().focus().setImage({ src: dataUrl }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strike"
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Code"
        >
          <CodeIcon size={16} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="H2"
        >
          <TypeIcon size={16} /> H2
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="H3"
        >
          <TypeIcon size={16} /> H3
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex gap-1">
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("left" as any)
              .run()
          }
          aria-label="Align left"
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("center" as any)
              .run()
          }
          aria-label="Align center"
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("right" as any)
              .run()
          }
          aria-label="Align right"
        >
          <AlignRight size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("justify" as any)
              .run()
          }
          aria-label="Align justify"
        >
          <AlignJustify size={16} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex gap-1 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="Insert link">
              <LinkIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[360px]">
            <div className="grid gap-2">
              <Label>URL</Label>
              <input
                className="border rounded p-2"
                placeholder="https://example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value;
                    if (val) {
                      editor.chain().focus().extendMarkRange("link").setLink({ href: val }).run();
                    }
                    document.getElementById("confirm-link-btn")?.click();
                  }
                }}
                onChange={(e) => {
                  seturl((e.target as HTMLInputElement).value);
                }}
              />
              <div className="flex justify-end gap-4">
                <Button variant={"outline"} onClick={() => editor.chain().focus().unsetLink().run()}>
                  Remove
                </Button>
                <DialogClose asChild>
                  <Button
                    id="confirm-link-btn"
                    onClick={() => {
                      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                      seturl("");
                    }}
                  >
                    Enter
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) insertImageFile(file);
            e.currentTarget.value = "";
          }}
        />

        {/* <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()} aria-label="Insert image">
          <ImageIcon size={16} />
        </Button> */}
      </div>
    </div>
  );
}

export function FormRichText({
  control,
  name,
  label = "Content",
  placeholder = "Write something...",
}: FormRichTextProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const editor = useTiptapEditor({
          content: field.value || "",
          placeholder,
          onUpdate: (html) => field.onChange(html),
        });

        useEffect(() => {
          // keep controlled value in sync if parent updates value programmatically
          if (field.value && editor && editor.getHTML() !== field.value) {
            editor.commands.setContent(field.value);
          }
        }, [field.value, editor]);

        return (
          <div className="w-full">
            <Label className="mb-2">{label}</Label>
            <div className="rounded-md border p-2">
              <RichTextToolbar editor={editor} />
              <EditorContent className="mt-2 min-h-[160px] prose max-w-none editor-content" editor={editor} />
            </div>
            {fieldState?.error && <p className="text-sm text-red-500 mt-1">{String(fieldState.error.message)}</p>}
          </div>
        );
      }}
    />
  );
}

// -----------------------------
// Example integration
// -----------------------------

// const schema = /* reuse or create your zod schema in your form file */ null as any;

// type ExampleValues = {
//   fullName: string;
//   remarks: string;
// };

// export default function ExampleFormWithTiptap() {
//   const form = useForm<ExampleValues>({
//     defaultValues: {
//       fullName: "",
//       remarks: "",
//     },
//   });

//   const onSubmit = (values: ExampleValues) => {
//     console.log("form values", values);
//     // remarks will be an HTML string
//   };

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <Label>Full name</Label>
//         <input {...form.register("fullName", { required: true })} className="w-full rounded border p-2" />
//       </div>

//       <FormRichText control={form.control} name="remarks" label="Remarks" placeholder="Write your bug report..." />

//       <div className="flex gap-2">
//         <Button type="submit">Submit</Button>
//         <Button type="button" variant="outline" onClick={() => form.reset()}>
//           Reset
//         </Button>
//       </div>

//       <pre className="text-xs">
//         <code>{JSON.stringify(form.watch(), null, 2)}</code>
//       </pre>
//     </form>
//   );
// }
