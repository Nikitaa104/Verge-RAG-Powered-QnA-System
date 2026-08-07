import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Files,
  Cpu,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { Document } from "../types";

interface UploadPageProps {
  onIngestDocument: (file: File, title: string) => Promise<Document>;
  uploadHistory: Document[];
}

export default function UploadPage({ onIngestDocument, uploadHistory }: UploadPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  
  const [status, setStatus] = useState<"idle" | "reading" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setError("");
    // Validate File Extension
    const validExtensions = ["txt", "md", "json", "csv", "pdf", "docx"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    
    if (!ext || !validExtensions.includes(ext)) {
      setError(`Unsupported file format (.${ext}). Supported formats: ${validExtensions.join(", ")}`);
      return;
    }

    // Validate size (max 20MB in UI mockup, let's restrict to 15MB)
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("File exceeds 15MB memory capacity. Please select a smaller file.");
      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setProgress(0);
  };

  const setError = (msg: string) => {
    setErrorMessage(msg);
    setStatus(msg ? "error" : "idle");
  };

  const triggerUpload = async () => {
    if (!file) return;

    setStatus("reading");
    setProgress(15);
      
    setProgress(40);
    setStatus("uploading");

    // Simulate a multi-step dynamic progress pipeline for UI feedback
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onIngestDocument(file, file.name);

      clearInterval(interval);
      setProgress(100);
      setStatus("success");
    } catch (err: any) {
      clearInterval(interval);
      setError("Failed to index and ingest the document on Verge database nodes.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setCategory("General");
    setDescription("");
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gray-50 text-left">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
            Ingestion Center
          </h1>
          <p className="mt-1 text-xs text-gray-500 font-light">
            Securely upload PDFs, specifications, reports, and manuals into Verge's secure isolated vector library.
          </p>
        </div>

        <button
          onClick={() => navigate("/documents")}
          className="flex items-center space-x-2 px-4 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs transition-all cursor-pointer shadow-sm"
        >
          <Files className="h-4 w-4" />
          <span>View Library</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Ingestion Widget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-[2px] rounded-[2rem] bg-gradient-to-tr from-[#FF007F] via-[#7B2CBF] to-[#00E676] shadow-xl">
            <div className="bg-white rounded-[1.92rem] p-6 md:p-8 space-y-6 text-left">
              
              {/* Top pill badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-[#E2F8EE] bg-[#ECFDF5] text-[#00A852] text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#00A852]"></span>
                  <span>Ingestion Pipeline Active</span>
                </div>
              </div>

              {status !== "success" ? (
                <>
                  {/* Drag Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-8 md:p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging 
                        ? "border-[#00A852] bg-[#ECFDF5] scale-[0.99] rounded-[1.5rem]" 
                        : file 
                        ? "border-[#F3EBEB] bg-[#FAF5F5] rounded-[1.5rem]" 
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100/50 hover:border-[#00A852] rounded-[1.5rem]"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".txt,.md,.json,.csv,.pdf,.docx"
                    />

                    {file ? (
                      <div className="space-y-4">
                        <div className="h-14 w-14 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <FileText className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 truncate max-w-md mx-auto">{file.name}</h3>
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB · Click to select a different file
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 text-gray-400 flex items-center justify-center mx-auto shadow-sm">
                          <UploadCloud className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Drag & Drop Your Document</h3>
                          <p className="text-xs text-gray-500 font-light mt-1">
                            or click to browse local files
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono">
                          Supports PDF, TXT, MD, JSON, CSV, DOCX (Max 15MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Metadata Config */}
                  {file && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left animate-fade-in">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block ml-1">Pipeline Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] text-xs text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all cursor-pointer shadow-sm"
                        >
                          <option value="General">General Intelligence</option>
                          <option value="Technical Specs">Technical Specs</option>
                          <option value="Legal Contracts">Legal & Contracts</option>
                          <option value="Financial Reports">Financial & Analytics</option>
                          <option value="AI & Models">AI Research Papers</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block ml-1">Ingest Summary / Tag (Optional)</label>
                        <input
                          type="text"
                          placeholder="Context tags or short description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] placeholder-[#BCA3A3] text-xs text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Progress Indicators / Errors */}
                  {status !== "idle" && status !== "error" && (
                    <div className="space-y-3 animate-fade-in text-left">
                      <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                          {status === "reading" && "Extracting raw file buffers..."}
                          {status === "uploading" && "Constructing parent-child vector index segments..."}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs flex items-start gap-2 text-left font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Control Actions */}
                  {file && (
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={resetForm}
                        disabled={status === "reading" || status === "uploading"}
                        className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:text-gray-950 transition-all disabled:opacity-50 text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        Clear File
                      </button>
                      <button
                        onClick={triggerUpload}
                        disabled={status === "reading" || status === "uploading"}
                        className="flex items-center space-x-2 px-6 py-3 bg-[#00A852] hover:bg-[#009447] text-white font-bold rounded-2xl transition-all disabled:opacity-50 text-xs cursor-pointer shadow-[0_8px_20px_-4px_rgba(0,168,82,0.3)]"
                      >
                        <span>Trigger Ingestion Node</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Success Landing */
                <div className="py-8 text-center space-y-6 animate-fade-in">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h2 className="font-display font-bold text-xl text-gray-900">Ingestion Complete!</h2>
                    <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
                      The document <strong className="text-gray-800">{file?.name}</strong> has been parsed successfully. Verge backend pipeline is running BM25 reciprocal rank fusion.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 max-w-sm mx-auto flex items-center justify-between text-left shadow-sm">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900">Status</h4>
                        <p className="text-[10px] font-mono text-gray-500">Processing vector blocks...</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      Active Ingest
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={resetForm}
                      className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      Ingest Another File
                    </button>
                    <button
                      onClick={() => navigate("/chat")}
                      className="flex items-center space-x-1.5 px-5 py-3 bg-[#00A852] hover:bg-[#009447] text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(0,168,82,0.3)]"
                    >
                      <span>Launch Chat Interface</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right 1 Col: Ingestion Guidelines */}
        <div className="space-y-6">
          
          <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm text-left space-y-4">
            <h3 className="font-display font-bold text-base text-gray-950 flex items-center">
              <Cpu className="h-4.5 w-4.5 text-emerald-600 mr-2" /> Ingestion Pipeline
            </h3>
            
            <div className="space-y-4 text-xs leading-relaxed text-gray-500 font-light">
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900">1. Structural Parsing</h4>
                <p>Verge reads PDFs, tables, research logs, and text files. It maps parent layout structures dynamically to retain semantic context across pages.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900">2. Hierarchical Chunking</h4>
                <p>Documents are divided into parent segments with nested child tokens to optimize the semantic recall balance.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900">3. Isolated Vector Keys</h4>
                <p>Embedded vectors are mapped exclusively to your credentials, isolated from foundational model public datasets.</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Queue Logs</h3>
              <RefreshCw className="h-3 w-3 text-emerald-600" />
            </div>

            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {uploadHistory.slice(0, 5).map((doc) => (
                <div key={doc.id} className="p-3 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2 overflow-hidden min-w-0">
                    <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700 truncate font-medium">{doc.name}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                    {doc.status}
                  </span>
                </div>
              ))}

              {uploadHistory.length === 0 && (
                <div className="text-center py-6 text-[10px] text-gray-400 font-mono">
                  Queue logs empty.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
