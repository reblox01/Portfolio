"use client"

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your description...",
  disabled = false
}) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="min-h-[200px] border rounded-md p-4 animate-pulse bg-muted" />
  }), []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className="bg-background"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          font-size: 14px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: hsl(var(--background));
        }

        .rich-text-editor .ql-editor {
          min-height: 200px;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }

        /* Dark mode styles */
        .dark .rich-text-editor .ql-toolbar {
          border-color: hsl(var(--border));
        }

        .dark .rich-text-editor .ql-container {
          border-color: hsl(var(--border));
        }

        .dark .rich-text-editor .ql-stroke {
          stroke: hsl(var(--foreground));
        }

        .dark .rich-text-editor .ql-fill {
          fill: hsl(var(--foreground));
        }

        .dark .rich-text-editor .ql-picker-label {
          color: hsl(var(--foreground));
        }

        .dark .rich-text-editor .ql-picker-options {
          background-color: hsl(var(--background));
          border-color: hsl(var(--border));
        }

        /* Light mode styles */
        .rich-text-editor .ql-toolbar {
          border-color: hsl(var(--border));
        }

        .rich-text-editor .ql-container {
          border-color: hsl(var(--border));
        }

        .rich-text-editor .ql-editor {
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
