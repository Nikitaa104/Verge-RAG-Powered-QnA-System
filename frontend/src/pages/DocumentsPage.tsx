import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  LayoutGrid, 
  List, 
  Trash2, 
  Edit3, 
  Eye, 
  FileText, 
  FolderOpen, 
  Filter, 
  ArrowUpDown,
  Plus,
  X,
  Sparkles,
  RefreshCw,
  FolderMinus
} from "lucide-react";
import { Document, DocumentStatus } from "../types";

interface DocumentsPageProps {
  documents: Document[];
  onDeleteDocument: (id: string) => Promise<void>;
  onRenameDocument: (id: string, name: string) => Promise<void>;
}

export default function DocumentsPage({ 
  documents, 
  onDeleteDocument,
  onRenameDocument 
}: DocumentsPageProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | DocumentStatus>("All");
  
  const [sortBy, setSortBy] = useState<"name" | "size" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Rename modal states
  const [renamingDoc, setRenamingDoc] = useState<Document | null>(null);
  const [newName, setNewName] = useState("");

  // View content modal states
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  // Categories extracted dynamically
  const categories = ["All", ...Array.from(new Set(documents.map(d => d.category || "General")))];

  // Filter & Search Logic
  const filteredDocs = documents
    .filter((doc) => {
      const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                          (doc.description || "").toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || doc.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || doc.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "size") {
        comparison = a.size - b.size;
      } else if (sortBy === "date") {
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const toggleSort = (field: "name" | "size" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingDoc || !newName.trim()) return;

    try {
      await onRenameDocument(renamingDoc.id, newName.trim());
      setRenamingDoc(null);
      setNewName("");
    } catch (err) {
      alert("Failed to rename document.");
    }
  };

  const startRename = (doc: Document) => {
    setRenamingDoc(doc);
    setNewName(doc.name);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}" from Verge's storage cluster?`)) {
      try {
        await onDeleteDocument(id);
      } catch (err) {
        alert("Failed to delete document.");
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50 text-left">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
            Document Library
          </h1>
          <p className="mt-1 text-xs text-gray-500 font-light">
            Browse, search, and manage files. Selected items can be queried inside the chat workspace.
          </p>
        </div>

        <button
          onClick={() => navigate("/upload")}
          className="flex items-center space-x-2 px-4 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium text-white shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Ingest New PDF</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-gray-600 font-semibold outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-gray-700">{cat === "All" ? "All Categories" : cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <FolderOpen className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent border-none text-xs text-gray-600 font-semibold outline-none cursor-pointer"
            >
              <option value="All" className="bg-white text-gray-700">All Statuses</option>
              <option value="READY" className="bg-white text-gray-700 font-semibold">READY</option>
              <option value="PROCESSING" className="bg-white text-gray-700 font-semibold">PROCESSING</option>
              <option value="FAILED" className="bg-white text-gray-700 font-semibold">FAILED</option>
            </select>
          </div>

          {/* Sort Toggles */}
          <button
            onClick={() => toggleSort("date")}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer shadow-sm"
          >
            <span>Date</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shrink-0 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all cursor-pointer ${viewMode === "grid" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-400 hover:text-gray-700"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-all cursor-pointer ${viewMode === "list" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-400 hover:text-gray-700"}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      {/* DOCUMENT LISTINGS */}
      {viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-lg border border-gray-200 bg-white flex flex-col justify-between h-56 text-left group relative shadow-sm hover:border-emerald-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                    <FileText className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    {doc.status === "READY" && (
                      <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                        Ready
                      </span>
                    )}
                    {doc.status === "PROCESSING" && (
                      <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Ingestion
                      </span>
                    )}
                    {doc.status === "FAILED" && (
                      <span className="text-[9px] font-mono font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-sm text-gray-950 truncate mb-1">
                  {doc.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mb-2">
                  {(doc.size / (1024 * 1024)).toFixed(2)} MB · {doc.pagesCount || 1} pages · {doc.category || "General"}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 font-light">
                  {doc.description || "No manual summary details compiled for this document."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-gray-150 pt-3 mt-4">
                <button
                  onClick={() => navigate(`/chat?docId=${doc.id}`)}
                  disabled={doc.status !== "READY"}
                  className="flex items-center space-x-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start Chat</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    title="View Contents"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => startRename(doc)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    title="Rename File"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete File"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase font-bold font-mono tracking-wider">
                <th className="py-3 px-6 font-semibold">Document Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Metrics</th>
                <th className="py-3 px-4 font-semibold">Indexing Status</th>
                <th className="py-3 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="border-b border-gray-150 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3.5 px-6 font-semibold text-gray-900 flex items-center space-x-2.5">
                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-sm">{doc.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-light">{doc.category || "General"}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                    {(doc.size / (1024 * 1024)).toFixed(2)} MB / {doc.pagesCount} p
                  </td>
                  <td className="py-3.5 px-4">
                    {doc.status === "READY" && (
                      <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                        Ready
                      </span>
                    )}
                    {doc.status === "PROCESSING" && (
                      <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded animate-pulse">
                        Parsing
                      </span>
                    )}
                    {doc.status === "FAILED" && (
                      <span className="text-[9px] font-mono font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/chat?docId=${doc.id}`)}
                        disabled={doc.status !== "READY"}
                        className="text-xs text-emerald-600 font-semibold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                      >
                        Start Chat
                      </button>
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        title="View Content"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startRename(doc)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        title="Rename"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="py-20 text-center space-y-4 border border-dashed border-gray-200 rounded-lg bg-white shadow-sm">
          <FolderMinus className="h-12 w-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-gray-900">No documents matched</h3>
            <p className="text-xs text-gray-400 font-light">Try adjusting your active filters or clear search query.</p>
          </div>
        </div>
      )}

      {/* 1. RENAME DOCUMENT MODAL */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-fade-in">
          <div className="p-[2px] rounded-[2rem] bg-gradient-to-tr from-[#FF007F] via-[#7B2CBF] to-[#00E676] max-w-md w-full shadow-2xl">
            <div className="bg-white rounded-[1.92rem] p-8 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-gray-850">Rename Ingested Document</h3>
                <button 
                  onClick={() => setRenamingDoc(null)} 
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-750 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRenameSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block ml-1">Filename</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] text-sm text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRenamingDoc(null)}
                    className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:text-gray-950 transition-all text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00A852] hover:bg-[#009447] text-white font-bold rounded-2xl text-xs transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(0,168,82,0.3)]"
                  >
                    Commit Rename
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. SLIDER VIEW DOCUMENT MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 p-4 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-lg w-full max-w-2xl h-[90vh] p-6 space-y-5 flex flex-col justify-between overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between shrink-0">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                  {viewingDoc.category || "General"}
                </span>
                <h3 className="font-display font-bold text-base text-gray-950 truncate max-w-lg">{viewingDoc.name}</h3>
              </div>
              <button 
                onClick={() => setViewingDoc(null)} 
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-y-auto border border-gray-200 bg-gray-50 rounded-lg p-5 text-left font-sans text-xs text-gray-700 font-light leading-relaxed whitespace-pre-line">
              {viewingDoc.textContent || "No text content compiled for this index record."}
            </div>

            {/* Slider footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-gray-400 font-mono">
                {viewingDoc.pagesCount || 1} pages parsed · {(viewingDoc.size / (1024 * 1024)).toFixed(2)} MB file metrics
              </span>
              <button
                onClick={() => {
                  setViewingDoc(null);
                  navigate(`/chat?docId=${viewingDoc.id}`);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-semibold transition-all cursor-pointer shadow-sm"
              >
                <span>Deploy to Chat Console</span>
                <Eye className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
