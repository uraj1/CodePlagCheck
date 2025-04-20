import React, { useEffect, useState } from 'react';
import MonacoEditor from '../components/editor/MonacoEditor';
import InputMonitor from '../components/editor/InputMonitor';
import { useActivity } from '../contexts/ActivityContext';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Sun, Moon, Code2, Play, X } from 'lucide-react';
import axios from 'axios';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' }
];

const EditorPage = () => {
  const [code, setCode] = useState<string>('// Start coding here...');
  const [language, setLanguage] = useState<string>('javascript');
  const [similarityReport, setSimilarityReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [output, setOutput] = useState<{ output: string[], errors: string[] } | null>(null);
  const { recordActivity } = useActivity();
  const { theme, toggleTheme } = useTheme();

  const handleEditorChange = (value: string) => {
    setCode(value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    setCode(getDefaultCodeForLanguage(e.target.value));
    setOutput(null);
  };

  const getDefaultCodeForLanguage = (lang: string): string => {
    switch (lang) {
      case 'python':
        return '# Start coding here...';
      case 'ruby':
        return '# Start coding here...';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        // Start coding here...\n    }\n}';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    // Start coding here...\n    return 0;\n}';
      case 'csharp':
        return 'using System;\n\nclass Program {\n    static void Main() {\n        // Start coding here...\n    }\n}';
      default:
        return '// Start coding here...';
    }
  };

  const checkPlagiarism = async () => {
    if (!code || code.trim() === getDefaultCodeForLanguage(language)) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/similarity/check', {
        content: code,
        language
      });
      setSimilarityReport(response.data);
    } catch (error) {
      console.error('Error checking plagiarism:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    if (!code || code.trim() === getDefaultCodeForLanguage(language)) return;
    
    setExecuting(true);
    setOutput(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/code/execute', {
        code,
        language
      });
      setOutput(response.data);
    } catch (error: any) {
      setOutput({
        output: [],
        errors: [error.response?.data?.error || 'Failed to execute code']
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Code Editor</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-[--secondary]" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="p-2 border border-gray-300 rounded-md bg-[--card] text-[--foreground]"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={executeCode}
            disabled={executing}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Play size={18} />
            {executing ? 'Running...' : 'Run Code'}
          </button>
          
          <button 
            onClick={checkPlagiarism}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? 'Analyzing...' : 'Check Plagiarism'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card editor-container lg:h-[calc(100vh-16rem)]">
          <InputMonitor onActivity={recordActivity}>
            <MonacoEditor 
              value={code} 
              onChange={handleEditorChange} 
              highlightedLines={similarityReport?.suspiciousLines || []}
              language={language}
            />
          </InputMonitor>
        </div>
        
        <div className="flex flex-col gap-6">
          {output && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Output</h2>
                <button
                  onClick={() => setOutput(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              {output.output.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Console Output:</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    {output.output.join('\n')}
                  </pre>
                </div>
              )}
              
              {output.errors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-[--error]">Errors:</h3>
                  <pre className="bg-[--error]/10 text-[--error] p-4 rounded-md overflow-x-auto">
                    {output.errors.join('\n')}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {similarityReport && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Similarity Report</h2>
              {similarityReport.similarityScore > 0.7 && (
                <div className="flex items-center gap-2 p-3 bg-[--error]/10 text-[--error] rounded-md mb-4">
                  <AlertCircle size={20} />
                  <p>High similarity detected! Score: {(similarityReport.similarityScore * 100).toFixed(2)}%</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Similarity Details</h3>
                  <p>Similarity Score: {(similarityReport.similarityScore * 100).toFixed(2)}%</p>
                  <p>Algorithm: {similarityReport.algorithm}</p>
                  <p>Suspicious Lines: {similarityReport.suspiciousLines?.length || 0}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Session Info</h3>
                  <p>Session ID: {similarityReport.sessionId}</p>
                  <p>Timestamp: {new Date(similarityReport.timestamp).toLocaleString()}</p>
                  <p>Language: {SUPPORTED_LANGUAGES.find(l => l.id === language)?.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;