import { useState } from 'react';
import { motion } from 'framer-motion';
import { converterAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { 
  ArrowRightLeft, 
  Save, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  Lightbulb,
  Zap,
  Upload,
  File
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Converter = () => {
  const { isAuthenticated } = useAuthStore();
  const [conversionMode, setConversionMode] = useState('json-to-toon');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showUploadZone, setShowUploadZone] = useState(false);

  const examples = {
    'json-to-toon': {
      json: `{
  "name": "Retro Platform",
  "version": "1.0.0",
  "features": [
    "JSON to TOON conversion",
    "Syntax highlighting",
    "Error detection"
  ],
  "config": {
    "theme": "retro-green",
    "soundEnabled": true
  }
}`,
      toon: `name: Retro Platform
version: 1.0.0
features:
  - JSON to TOON conversion
  - Syntax highlighting
  - Error detection
config:
  theme: retro-green
  soundEnabled: true`,
    },
  };

  const handleConvert = async () => {
    if (!input.trim()) {
      toast.error('Please enter some data to convert');
      return;
    }

    setIsConverting(true);
    setErrors([]);
    setWarnings([]);

    try {
      const result =
        conversionMode === 'json-to-toon'
          ? await converterAPI.jsonToToon(input)
          : await converterAPI.toonToJson(input);

      if (result.success) {
        setOutput(result.output);
        setMetrics(result.metrics);
        setErrors(result.errors || []);
        setWarnings(result.warnings || []);
        toast.success('Conversion successful! ⚡');
      } else {
        setErrors(result.errors || []);
        toast.error('Conversion failed with errors');
      }
    } catch (error) {
      toast.error('Conversion failed: ' + error.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleExplain = async () => {
    if (!input.trim()) {
      toast.error('Please enter JSON data to explain');
      return;
    }

    try {
      const result = await converterAPI.explain(input);
      setExplanation(result.explanation);
      toast.success('Explanation generated!');
    } catch (error) {
      toast.error('Failed to generate explanation');
    }
  };

  const handleSwap = () => {
    setConversionMode(prev =>
      prev === 'json-to-toon' ? 'toon-to-json' : 'json-to-toon'
    );
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = conversionMode === 'json-to-toon' ? 'output.toon' : 'output.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const loadExample = () => {
    if (conversionMode === 'json-to-toon') {
      setInput(examples['json-to-toon'].json);
    }
    setUploadedFileName('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Validate file type
    const validExtensions = ['.json', '.toon', '.txt'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      toast.error('Invalid file type. Only .json, .toon, and .txt files are allowed');
      return;
    }

    setIsConverting(true);
    setUploadedFileName(file.name);
    
    try {
      const result = await converterAPI.uploadAndConvert(file, conversionMode);
      
      if (result.success) {
        setInput(result.output || '');
        setOutput(result.output);
        setMetrics(result.metrics);
        setErrors(result.errors || []);
        setWarnings(result.warnings || []);
        toast.success('File uploaded and converted successfully! ⚡');
      } else {
        setErrors(result.errors || []);
        toast.error('File conversion failed with errors');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'File upload failed');
      setUploadedFileName('');
    } finally {
      setIsConverting(false);
      e.target.value = ''; // Reset file input
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-pixel mb-4">DATA CONVERTER</h1>
        <p className="text-terminal-dim">
          Transform your data between JSON and TOON formats
        </p>
      </motion.div>

      {/* Controls */}
      <div className="card-retro">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center md:justify-start">
            <button
              onClick={() => setConversionMode('json-to-toon')}
              className={`btn-neon px-3 md:px-4 py-2 text-sm md:text-base flex-1 md:flex-none ${
                conversionMode === 'json-to-toon' ? 'shadow-neon' : ''
              }`}
            >
              JSON → TOON
            </button>
            <button
              onClick={handleSwap}
              className="btn-neon px-3 md:px-4 py-2"
              title="Swap input/output"
            >
              <ArrowRightLeft size={18} />
            </button>
            <button
              onClick={() => setConversionMode('toon-to-json')}
              className={`btn-neon px-3 md:px-4 py-2 text-sm md:text-base flex-1 md:flex-none ${
                conversionMode === 'toon-to-json' ? 'shadow-neon' : ''
              }`}
            >
              TOON → JSON
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <label className="btn-neon px-3 py-2 text-xs md:text-sm flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-1">
              <Upload size={16} />
              <span className="hidden sm:inline">Upload</span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".json,.toon,.txt"
                className="hidden"
                disabled={isConverting}
              />
            </label>
            <button onClick={loadExample} className="btn-neon px-3 py-2 text-xs md:text-sm flex-1 md:flex-none">
              <span className="hidden sm:inline">Load </span>Example
            </button>
            <button onClick={handleExplain} className="btn-neon px-3 py-2 text-xs md:text-sm flex-1 md:flex-none">
              <Lightbulb size={16} className="inline mr-1" />
              <span className="hidden sm:inline">Explain</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Editor */}
        <div className="card-retro">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              INPUT [{conversionMode === 'json-to-toon' ? 'JSON' : 'TOON'}]
            </h3>
            <div className="flex items-center gap-2">
              {uploadedFileName && (
                <span className="text-xs text-terminal-dim flex items-center gap-1">
                  <File size={14} />
                  {uploadedFileName}
                </span>
              )}
              <button
                onClick={() => {
                  setInput('');
                  setUploadedFileName('');
                }}
                className="text-sm text-terminal-dim hover:text-terminal-bright"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="border-2 border-terminal-dim rounded-lg overflow-hidden">
            <Editor
              height="300px"
              className="md:h-[400px]"
              defaultLanguage={conversionMode === 'json-to-toon' ? 'json' : 'plaintext'}
              theme="vs-dark"
              value={input}
              onChange={value => setInput(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Output Editor */}
        <div className="card-retro">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-lg md:text-xl font-bold">
              OUTPUT [{conversionMode === 'json-to-toon' ? 'TOON' : 'JSON'}]
            </h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="btn-neon px-3 py-2 text-sm flex-1 sm:flex-none"
                disabled={!output}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleDownload}
                className="btn-neon px-3 py-2 text-sm flex-1 sm:flex-none"
                disabled={!output}
                title="Download file"
              >
                <Download size={16} />
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="btn-neon px-3 py-2 text-sm flex-1 sm:flex-none"
                  disabled={!output}
                  title="Save conversion"
                >
                  <Save size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="border-2 border-terminal-dim rounded-lg overflow-hidden">
            <Editor
              height="300px"
              className="md:h-[400px]"
              defaultLanguage={conversionMode === 'json-to-toon' ? 'plaintext' : 'json'}
              theme="vs-dark"
              value={output}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: 'Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
      </div>

      {/* Convert Button */}
      <div className="text-center">
        <button
          onClick={handleConvert}
          disabled={isConverting || !input.trim()}
          className={`btn-neon px-6 md:px-12 py-3 md:py-4 text-base md:text-xl w-full sm:w-auto ${
            isConverting ? 'animate-pulse' : 'hover:scale-105 transform transition-transform'
          }`}
        >
          <Zap size={20} className="inline mr-2 md:w-6 md:h-6" />
          {isConverting ? 'CONVERTING...' : 'CONVERT NOW'}
        </button>
      </div>

      {/* Metrics */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-retro"
        >
          <h3 className="text-xl font-bold mb-4">METRICS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-terminal-dim text-sm">Processing Time</div>
              <div className="text-2xl font-bold text-terminal-bright">
                {metrics.processingTime}ms
              </div>
            </div>
            <div>
              <div className="text-terminal-dim text-sm">Input Size</div>
              <div className="text-2xl font-bold text-terminal-bright">
                {metrics.inputSize} bytes
              </div>
            </div>
            <div>
              <div className="text-terminal-dim text-sm">Output Size</div>
              <div className="text-2xl font-bold text-terminal-bright">
                {metrics.outputSize} bytes
              </div>
            </div>
            <div>
              <div className="text-terminal-dim text-sm">Compression</div>
              <div className="text-2xl font-bold text-terminal-bright">
                {((1 - metrics.outputSize / metrics.inputSize) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Errors and Warnings */}
      {(errors.length > 0 || warnings.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {errors.length > 0 && (
            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-500/10">
              <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                <AlertCircle /> ERRORS
              </h3>
              {errors.map((error, i) => (
                <div key={i} className="text-red-400 font-mono text-sm">
                  {error.line && `Line ${error.line}: `}
                  {error.message}
                </div>
              ))}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-500/10">
              <h3 className="text-xl font-bold text-yellow-500 mb-2 flex items-center gap-2">
                <AlertCircle /> WARNINGS
              </h3>
              {warnings.map((warning, i) => (
                <div key={i} className="text-yellow-400 font-mono text-sm">
                  {warning.line && `Line ${warning.line}: `}
                  {warning.message}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-retro"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb /> AI EXPLANATION
          </h3>
          <pre className="code-block whitespace-pre-wrap">{explanation}</pre>
        </motion.div>
      )}
    </div>
  );
};

export default Converter;
