import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TextEditorProps {
  content: string;
  setContent: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[250px] p-5 rounded-xl focus:outline-none font-inter bg-[#1e1e1e] text-[#e5e7eb] text-[15px] leading-relaxed prose prose-sm sm:prose-base prose-invert",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2 font-inter">
      <label className="block text-sm font-medium text-bright-sun-400 mb-2">
        Job Description
      </label>
      <div className="rounded-xl border border-mine-shaft-700 bg-[#1e1e1e] shadow-lg">
        <EditorContent editor={editor} />
      </div>

      {/* Override default ProseMirror dropdown-like item styles */}
      <style jsx global>{`
        .ProseMirror ul li:hover,
        .ProseMirror ol li:hover {
          background-color: #facc15; /* bright-sun-400 */
          color: #1c1c1c !important;  /* dark text for contrast */
          border-radius: 6px;
        }

        .ProseMirror ul li,
        .ProseMirror ol li {
          padding: 4px 8px;
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
