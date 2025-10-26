"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { inputMessageType } from "@/src/utilities";

function MessageInputWithSubmit() {
  const [mounted, setMounted] = useState(false);
  const [inputMessage, setInputMessage] = useState<inputMessageType>({
    text: "",
    textHTML: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Your message here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    immediatelyRender: false,
    content: inputMessage?.textHTML,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setInputMessage({ text, textHTML: html });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none h-[45px] w-full px-2 rounded text-sm dark:text-white text-black",
        "data-placeholder": "Your message here...",
      },
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !editor) {
    return (
      <form className={`flex items-center gap-2 justify-between`}>
        <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      </form>
    );
  }

  return (
    <form className={`flex items-center gap-2 justify-between h-full`}>
      <div className="w-full h-full flex items-center px-2">
        <section className="flex items-center h-full">
          <Button type="button" size={"icon"} variant={"outline"}>
            <Paperclip />
          </Button>
        </section>
        <EditorContent editor={editor} className="flex flex-1" />
        <section className="flex items-center justify-start h-full w-22">
          <Button
            disabled={inputMessage?.text === ""}
            type="submit"
            variant={"link"}
            className={`text-green-700 bg-green-100 transition-all flex items-center gap-1 hover:gap-2`}
          >
            Send
            <Send />
          </Button>
        </section>
      </div>
    </form>
  );
}

export default MessageInputWithSubmit;
