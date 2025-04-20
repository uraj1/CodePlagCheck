import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTheme } from '../../contexts/ThemeContext';


interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  highlightedLines?: number[];
  language: string;
}

const MonacoEditor = ({ value, onChange, highlightedLines = [], language }: MonacoEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { theme } = useTheme();

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Add custom themes
    monaco.editor.defineTheme('plagiarismThemeDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2D2E',
        'editorCursor.foreground': '#AEAFAD',
        'editorWhitespace.foreground': '#404040'
      }
    });

    monaco.editor.defineTheme('plagiarismThemeLight', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1F2937',
        'editor.lineHighlightBackground': '#F3F4F6',
        'editorCursor.foreground': '#4B5563',
        'editorWhitespace.foreground': '#D1D5DB'
      }
    });

    monaco.editor.setTheme(theme === 'dark' ? 'plagiarismThemeDark' : 'plagiarismThemeLight');
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme(
        theme === 'dark' ? 'plagiarismThemeDark' : 'plagiarismThemeLight'
      );
    }
  }, [theme]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current && highlightedLines.length > 0) {
      const monaco = monacoRef.current;
      
      // Clear previous decorations
      editorRef.current.deltaDecorations([], []);
      
      // Add new decorations for suspicious lines
      const decorations = highlightedLines.map(lineNumber => ({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100',
          linesDecorationsClassName: 'bg-red-500 w-1',
          glyphMarginClassName: 'bg-red-500 rounded-full',
        }
      }));
      
      editorRef.current.deltaDecorations([], decorations);
    }
  }, [highlightedLines, theme]);

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme={theme === 'dark' ? 'plagiarismThemeDark' : 'plagiarismThemeLight'}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        tabSize: 2,
        automaticLayout: true,
        glyphMargin: true,
      }}
    />
  );
};

export default MonacoEditor;