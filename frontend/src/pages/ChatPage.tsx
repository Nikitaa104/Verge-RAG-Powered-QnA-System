import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { 
  Send, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  StopCircle, 
  Clock, 
  Database,
  User,
  ExternalLink,
  X
} from "lucide-react";
import { Document, Conversation, Message, Citation } from "../types";

interface ChatPageProps {
  conversations: Conversation[];
  documents: Document[];
  activeConvId?: string;
  onSendMessage: (conversationId: string, text: string, docId?: string) => Promise<void>;
  onNewConversation: (title?: string, docId?: string) => Promise<Conversation>;
  onRefresh: () => void;
}

export default function ChatPage({
  conversations,
  documents,
  activeConvId,
  onSendMessage,
  onNewConversation,
  onRefresh
}: ChatPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const docQueryId = searchParams.get("docId");
  const convQueryId = searchParams.get("id");

  const [input, setInput] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(docQueryId || undefined);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active conversation
  useEffect(() => {
    let currentConvId = convQueryId || activeConvId;
    
    if (currentConvId) {
      const found = conversations.find(c => c.id === currentConvId);
      if (found) {
        setActiveConversation(found);
      }
    } else if (conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, convQueryId, activeConvId]);

  // Sync selected doc if query param changes
  useEffect(() => {
    if (docQueryId) {
      setSelectedDocId(docQueryId);
    }
  }, [docQueryId]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isGenerating]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isGenerating) return;

    setInput("");
    setIsGenerating(true);

    let currentConv = activeConversation;
    if (!currentConv) {
      currentConv = await onNewConversation("RAG Analysis Session", selectedDocId);
    }

    try {
      await onSendMessage(currentConv.id, query.trim(), selectedDocId);
    } catch (err) {
      console.error("Chat page error sending message:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 2 || isGenerating) return;
    
    // Find last user message
    const msgs = activeConversation.messages;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        handleSend(msgs[i].content);
        break;
      }
    }
  };

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="flex-1 flex flex-col h-screen bg-white text-left overflow-hidden relative border-l border-gray-100">
      
      {/* 1. ACTIVE DOCUMENT BADGE TOP BAR */}
      <div className="shrink-0 flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
            <Database className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">Search Context Selection</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <select
                value={selectedDocId || "global"}
                onChange={(e) => setSelectedDocId(e.target.value === "global" ? undefined : e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-950 focus:outline-none cursor-pointer max-w-[320px] truncate"
              >
                <option value="global" className="text-gray-600 bg-white">🌐 Entire Library (Global Hybrid Search)</option>
                {documents.filter(d => d.status === "READY").map(doc => (
                  <option key={doc.id} value={doc.id} className="text-gray-900 bg-white">📄 {doc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedDoc && (
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
            <FileText className="h-3.5 w-3.5" />
            <span className="font-mono">{selectedDoc.category} · {selectedDoc.pagesCount}p</span>
          </div>
        )}
      </div>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-6 bg-gray-50/45">
        
        {activeConversation && activeConversation.messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex space-x-4 max-w-4xl mx-auto p-5 rounded-lg border shadow-sm transition-all ${
                isAssistant 
                  ? "bg-white border-gray-200 text-gray-800" 
                  : "bg-emerald-50 border-emerald-150 text-gray-900"
              }`}
            >
              {/* Avatar */}
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 shadow-sm ${
                isAssistant 
                  ? "bg-emerald-600 border-emerald-600 text-white" 
                  : "bg-white border-gray-200 text-gray-600"
              }`}>
                {isAssistant ? <Sparkles className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>

              {/* Text / Bubble Details */}
              <div className="flex-1 min-w-0 space-y-3">
                
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                    {isAssistant ? "Verge Intelligence Node" : "User Researcher"}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-gray-400 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                      title="Copy Message"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Markdown body wrapper */}
                <div className="markdown-body text-xs md:text-sm text-gray-800">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Dynamic Citations Grid */}
                {isAssistant && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-4 border-t border-gray-150 space-y-2 text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                      Semantic Reference Citations ({msg.citations.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {msg.citations.map((cit) => (
                        <div
                          key={cit.id}
                          onClick={() => setActiveCitation(cit)}
                          className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 hover:border-emerald-600 cursor-pointer transition-all flex items-center justify-between shadow-sm"
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 rounded px-1.5 py-0.5 font-bold shrink-0">
                              [{cit.id.split('-')[1] || "1"}]
                            </span>
                            <span className="text-[10px] text-gray-500 truncate pr-2 font-mono font-medium">Page {cit.page} · Match Score: {(cit.score * 100).toFixed(0)}%</span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-gray-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Dynamic Generating/Typing State */}
        {isGenerating && (
          <div className="flex space-x-4 max-w-4xl mx-auto p-5 rounded-lg border border-gray-200 bg-white animate-pulse text-left shadow-sm">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                Retrieving & Synthesizing response...
              </span>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. STICKY MESSAGE INPUT CONTAINER */}
      <div className="shrink-0 p-4 border-t border-gray-200 bg-white relative">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Controls toolbar */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 font-mono">
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full"></span>
                Sovereign Model Online
              </span>
              <span>·</span>
              <span>Enter to submit / Shift+Enter for newline</span>
            </div>

            {activeConversation && activeConversation.messages.length > 1 && !isGenerating && (
              <button
                onClick={handleRegenerate}
                className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer font-semibold"
                title="Regenerate last answer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Regenerate</span>
              </button>
            )}

            {isGenerating && (
              <button
                onClick={() => setIsGenerating(false)}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors cursor-pointer font-semibold"
                title="Stop prompt streaming"
              >
                <StopCircle className="h-3.5 w-3.5" />
                <span>Stop Synthesis</span>
              </button>
            )}
          </div>

          {/* Form and Input Area */}
          <div className="relative rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] p-2 focus-within:border-[#00A852] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A852]/20 transition-all shadow-sm">
            <textarea
              rows={2}
              placeholder={selectedDoc ? `Ask a question about "${selectedDoc.name}"...` : "Select a search context or ask Verge any questions..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-4 py-2 text-xs md:text-sm text-gray-800 placeholder-[#BCA3A3] border-none outline-none resize-none animate-fade-in"
            />
            
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isGenerating}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00A852] hover:bg-[#009447] disabled:opacity-45 transition-all cursor-pointer text-white shadow-[0_4px_12px_rgba(0,168,82,0.25)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center font-mono font-medium">
            Verge ensures absolute groundedness. Review mapped references below assistant response blocks.
          </p>
        </div>
      </div>

      {/* CITATION VIEWING DETAIL DIALOG OVERLAY */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-fade-in">
          <div className="p-[2px] rounded-[2rem] bg-gradient-to-tr from-[#FF007F] via-[#7B2CBF] to-[#00E676] max-w-lg w-full shadow-2xl">
            <div className="bg-white rounded-[1.92rem] p-8 space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-gray-150">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold px-2 py-0.5 rounded">Reference Segment</span>
                  <span className="text-xs text-gray-500 font-mono">Page {activeCitation.page} · Matching: {(activeCitation.score * 100).toFixed(0)}%</span>
                </div>
                <button 
                  onClick={() => setActiveCitation(null)} 
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-750 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="text-xs text-gray-600 font-light font-sans leading-relaxed bg-[#FAF5F5] border border-[#F3EBEB] p-4 rounded-2xl whitespace-pre-wrap max-h-56 overflow-y-auto">
                "{activeCitation.text}"
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setActiveCitation(null)}
                  className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:text-gray-950 transition-all text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Dismiss Reference
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
