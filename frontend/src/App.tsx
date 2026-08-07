import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Document, Conversation } from "./types";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import DocumentsPage from "./pages/DocumentsPage";
import ChatPage from "./pages/ChatPage";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import api from "./services/api";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const userEmail = user?.email || "researcher@verge.ai";
  const userName = user?.email?.split('@')[0] || "Dr. Nikita Pandey";

  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Fetch initially from Express server APIs
  const fetchData = async () => {
    try {
      const docsRes = await api.get("/documents");
      if (docsRes.data.success) {
        const mappedDocs = docsRes.data.data.documents.map((d: any) => ({
          ...d,
          id: d._id,
          name: d.title,
          uploadDate: d.createdAt,
        }));
        setDocuments(mappedDocs);
      }

      const convsRes = await api.get("/conversations");
      if (convsRes.data.success) {
        const mappedConvs = convsRes.data.data.conversations.map((c: any) => ({
          ...c,
          id: c._id,
        }));
        setConversations(mappedConvs);
        if (mappedConvs.length > 0 && !activeConvId) {
          setActiveConvId(mappedConvs[0].id);
        }
      }
      setIsDataLoaded(true);
    } catch (err) {
      console.error("Unable to load platform databases:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Periodically poll document statuses to update them from "QUEUED" or "PROCESSING" or "INDEXING" to "READY"
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const hasProcessing = documents.some(d => ["QUEUED", "PROCESSING", "INDEXING", "PENDING"].includes(d.status));
    
    if (isAuthenticated && hasProcessing) {
      interval = setInterval(() => {
        fetchData();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [documents, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Triggering new multi-document chat session
  const handleNewConversation = async (title?: string, docId?: string) => {
    try {
      const res = await api.post("/conversations", { title, docId });
      if (res.data.success) {
        const newConv = {
          ...res.data.data.conversation,
          id: res.data.data.conversation._id,
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newConv.id);
        navigate(`/chat?id=${newConv.id}${docId ? `&docId=${docId}` : ""}`);
        return newConv;
      }
    } catch (err) {
      console.error("Failed to spin up conversation node:", err);
    }
  };

  // Ingest Document Handler
  const handleIngestDocument = async (file: File, title: string): Promise<Document> => {
    const formData = new FormData();
    formData.append("pdf", file);
    if (title) formData.append("title", title);

    const res = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    if (!res.data.success) {
      throw new Error("Pipeline Ingestion Rejected");
    }

    const newDoc = {
      ...res.data.data.document,
      id: res.data.data.document._id,
      name: res.data.data.document.title,
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  // Delete Document
  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await api.delete(`/documents/${id}`);
      if (res.data.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error("Delete operation rejected:", err);
    }
  };

  // Rename Document
  const handleRenameDocument = async (id: string, name: string) => {
    try {
      const res = await api.patch(`/documents/${id}`, { title: name });
      if (res.data.success) {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, name: res.data.data.document.title } : d));
      }
    } catch (err) {
      console.error("Rename operation rejected:", err);
    }
  };

  // Send message and trigger Gemini stream simulation / synthesis
  const handleSendMessage = async (conversationId: string, text: string, docId?: string) => {
    // 1. Optimistically append user message to local state
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      role: "user" as const,
      content: text,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          lastUpdated: new Date().toISOString()
        };
      }
      return c;
    }));

    try {
      const token = localStorage.getItem("verge_token");
      const res = await fetch("/api/v1/chat/ask", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId, message: text, docId })
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let aiMessageId = `msg-ai-${Date.now()}`;
        
        setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, {
                id: aiMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date().toISOString()
              }],
              lastUpdated: new Date().toISOString()
            };
          }
          return c;
        }));

        let accumulatedResponse = "";
        let finalCitations: any[] = [];

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '').trim();
                if (dataStr) {
                  try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed.done) {
                       finalCitations = parsed.sources || [];
                       done = true;
                    } else if (parsed.content) {
                       accumulatedResponse += parsed.content;
                       setConversations(prev => prev.map(c => {
                         if (c.id === conversationId) {
                           const newMessages = [...c.messages];
                           const aiMsgIndex = newMessages.findIndex(m => m.id === aiMessageId);
                           if (aiMsgIndex > -1) {
                             newMessages[aiMsgIndex] = {
                               ...newMessages[aiMsgIndex],
                               content: accumulatedResponse
                             };
                           }
                           return { ...c, messages: newMessages, lastUpdated: new Date().toISOString() };
                         }
                         return c;
                       }));
                    }
                  } catch (e) {
                    console.error("Error parsing SSE JSON", e);
                  }
                }
              }
            }
          }
        }
        
        setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
            const newMessages = [...c.messages];
            const aiMsgIndex = newMessages.findIndex(m => m.id === aiMessageId);
            if (aiMsgIndex > -1 && finalCitations.length > 0) {
              newMessages[aiMsgIndex] = {
                ...newMessages[aiMsgIndex],
                citations: finalCitations.map(cit => ({
                  id: cit.chunkId || `cit-${Math.random()}`,
                  text: cit.text,
                  page: cit.page || 1,
                  score: 0.99
                }))
              };
            }
            return { ...c, messages: newMessages, lastUpdated: new Date().toISOString() };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error("Platform chat request failed:", err);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await api.delete(`/conversations/${id}`);
      if (res.data.success) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) {
          const remaining = conversations.filter(c => c.id !== id);
          setActiveConvId(remaining.length > 0 ? remaining[0].id : undefined);
        }
      }
    } catch (err) {
      console.error("Failed to delete dialogue:", err);
    }
  };

  const isWorkspaceRoute = ["/dashboard", "/upload", "/documents", "/chat"].some(path => 
    location.pathname === path || (path === "/chat" && location.pathname.startsWith("/chat"))
  );

  return (
    <div className="min-h-screen bg-bg-dark text-white flex overflow-hidden">
      {/* Sidebar Layout wrapper */}
      {isAuthenticated && isWorkspaceRoute && (
        <Sidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onNewConversation={() => handleNewConversation()}
          onDeleteConversation={handleDeleteConversation}
          onLogout={handleLogout}
          userEmail={userEmail}
          userName={userName}
        />
      )}

      {/* Primary Routes */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard 
                  documents={documents} 
                  conversations={conversations}
                  onNewConversation={() => handleNewConversation()}
                  onRefresh={fetchData}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
          
          <Route 
            path="/upload" 
            element={
              isAuthenticated ? (
                <UploadPage 
                  onIngestDocument={handleIngestDocument}
                  uploadHistory={documents}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />

          <Route 
            path="/documents" 
            element={
              isAuthenticated ? (
                <DocumentsPage 
                  documents={documents}
                  onDeleteDocument={handleDeleteDocument}
                  onRenameDocument={handleRenameDocument}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />

          <Route 
            path="/chat" 
            element={
              isAuthenticated ? (
                <ChatPage 
                  conversations={conversations}
                  documents={documents}
                  activeConvId={activeConvId}
                  onSendMessage={handleSendMessage}
                  onNewConversation={handleNewConversation}
                  onRefresh={fetchData}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
