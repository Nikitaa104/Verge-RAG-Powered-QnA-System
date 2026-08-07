import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  TrendingUp, 
  Activity, 
  Layers, 
  Database,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  Plus
} from "lucide-react";
import { Document, Conversation } from "../types";

interface DashboardProps {
  documents: Document[];
  conversations: Conversation[];
  onNewConversation: () => void;
  onRefresh: () => void;
}

export default function Dashboard({ 
  documents, 
  conversations, 
  onNewConversation,
  onRefresh 
}: DashboardProps) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Stats calculation
  const totalDocsCount = documents.length;
  const readyDocsCount = documents.filter(d => d.status === "READY").length;
  const processingDocsCount = documents.filter(d => d.status === "PROCESSING").length;
  const totalPagesCount = documents.reduce((sum, d) => sum + (d.pagesCount || 1), 0);
  const totalSizeMB = (documents.reduce((sum, d) => sum + d.size, 0) / (1024 * 1024)).toFixed(2);

  const recentDocs = documents.slice(0, 4);
  const recentChats = conversations.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gray-50 text-left">
      
      {/* 1. TOP STATS BAR / GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
              {greeting}, Researcher
            </h1>
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-1 text-xs text-gray-500 font-light">
            Monitor the indexing state of your secure documents and custom search pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Refresh Ingestion States"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center space-x-2 px-4 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium text-white shadow-sm transition-all cursor-pointer text-sm"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1 */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Total Library</span>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-bold text-2xl text-gray-950">{totalDocsCount}</span>
              <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +100%
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">{readyDocsCount} Ready · {processingDocsCount} Processing</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Indexed Space</span>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-bold text-2xl text-gray-950">{totalSizeMB}</span>
              <span className="text-xs text-gray-500 font-mono font-medium">MB</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">RAM/Vector buffer loaded</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Synthesized Pages</span>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-bold text-2xl text-gray-950">{totalPagesCount}</span>
              <span className="text-xs text-gray-500 font-mono font-medium">pages</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Auto-partitioned chunks</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Reranking State</span>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-bold text-2xl text-gray-950">99.8%</span>
              <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center">
                <Activity className="h-3 w-3 mr-0.5" /> High
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Cluster precision index</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <h3 className="font-display font-bold text-base text-emerald-900 flex items-center">
            <Sparkles className="h-4 w-4 text-emerald-600 mr-2" /> Global Multi-Doc Knowledge Retrieval
          </h3>
          <p className="text-xs text-emerald-700 font-light max-w-xl">
            Verge supports questioning multiple research documents simultaneously. Query your entire parsed context instead of switching individual files.
          </p>
        </div>
        <button
          onClick={onNewConversation}
          className="w-full md:w-auto shrink-0 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg font-medium text-white shadow-sm cursor-pointer transition-all text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Launch Chat Console</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4. DETAILS - SPLIT SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ingested Document Pipeline */}
        <div className="lg:col-span-2 border border-gray-200 rounded-lg bg-white p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display font-bold text-lg text-gray-950">Active Document Pipeline</h2>
              <p className="text-xs text-gray-400 font-light">Structure parsed coordinates & ingestion logs</p>
            </div>
            <button
              onClick={() => navigate("/documents")}
              className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-semibold flex items-center cursor-pointer"
            >
              Manage Documents <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-lg border border-gray-150 bg-gray-50/50 flex items-center justify-between hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-gray-500 border border-gray-200 shrink-0 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">{doc.name}</h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      {(doc.size / (1024 * 1024)).toFixed(2)} MB · {doc.category || "General"} · {doc.pagesCount} pages
                    </p>
                  </div>
                </div>

                <div>
                  {doc.status === "READY" && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded bg-emerald-50">
                      Ready
                    </span>
                  )}
                  {doc.status === "PROCESSING" && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded bg-emerald-50 animate-pulse">
                      Parsing
                    </span>
                  )}
                  {doc.status === "FAILED" && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 border border-red-200 px-2.5 py-1 rounded bg-red-50">
                      Failed
                    </span>
                  )}
                </div>
              </div>
            ))}

            {recentDocs.length === 0 && (
              <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                No active documents ingested.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Chats */}
        <div className="border border-gray-200 rounded-lg bg-white p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="font-display font-bold text-lg text-gray-950">Recent Dialogues</h2>
                <p className="text-xs text-gray-400 font-light">Interactive search & chat history</p>
              </div>
              <button
                onClick={onNewConversation}
                className="h-7 w-7 rounded border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-emerald-600 cursor-pointer shadow-sm transition-colors"
                title="Start Dialogue"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/chat?id=${chat.id}`)}
                  className="p-3.5 rounded-lg border border-gray-150 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[150px]">{chat.title}</h4>
                    <span className="text-[9px] font-mono text-gray-400 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {chat.messages[chat.messages.length - 1]?.content || "Empty chat session."}
                  </p>
                </div>
              ))}

              {recentChats.length === 0 && (
                <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                  No dialog history found.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150">
            <button
              onClick={() => navigate("/chat")}
              className="w-full flex items-center justify-center space-x-1 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm font-medium"
            >
              <span>Review All Dialogue Sessions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
