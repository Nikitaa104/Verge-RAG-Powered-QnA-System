import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  UploadCloud, 
  MessageSquare, 
  Files, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  LogOut, 
  Sparkles, 
  Activity, 
  User,
  Settings
} from "lucide-react";
import { Conversation } from "../types";

interface SidebarProps {
  conversations: Conversation[];
  activeConvId?: string;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
}

export default function Sidebar({
  conversations,
  activeConvId,
  onNewConversation,
  onDeleteConversation,
  onLogout,
  userEmail = "user@verge.ai",
  userName = "Developer Account"
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/upload", label: "Upload Center", icon: UploadCloud },
    { path: "/documents", label: "My Documents", icon: Files },
    { path: "/chat", label: "AI RAG Chat", icon: MessageSquare }
  ];

  const handleConversationClick = (id: string) => {
    navigate(`/chat?id=${id}`);
  };

  const currentPath = location.pathname;

  return (
    <aside 
      className={`bg-white h-screen border-r border-gray-200 flex flex-col justify-between transition-all duration-300 relative z-30 ${
        isCollapsed ? "w-20" : "w-68"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-all z-50 cursor-pointer shadow-sm"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Main Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Brand Header */}
        <div className={`p-6 border-b border-gray-100 flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-gray-900">
                Verge<span className="text-emerald-600">.</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <Activity className="h-2.5 w-2.5 text-emerald-500" /> Platform Active
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="p-4">
          <button
            onClick={onNewConversation}
            className={`w-full flex items-center justify-center bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/70 hover:border-emerald-300 rounded-lg py-2.5 text-sm font-medium transition-all group cursor-pointer ${
              isCollapsed ? "px-0" : "px-4 space-x-2"
            }`}
            title="Start New Conversation"
          >
            <Plus className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>New Intelligence Chat</span>}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2 space-y-1 border-b border-gray-100">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentPath === item.path || (item.path === "/chat" && currentPath.startsWith("/chat"));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg py-2.5 transition-all text-sm font-medium group relative ${
                  isCollapsed ? "justify-center px-0" : "px-3 space-x-3"
                } ${
                  isSelected 
                    ? "bg-emerald-50 border-l-2 border-emerald-600 text-emerald-700 font-semibold" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title={item.label}
              >
                <IconComponent className={`h-5 w-5 shrink-0 ${isSelected ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Conversations History */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Recent Analysed Sessions
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                {conversations.length}
              </span>
            </div>
          )}

          {conversations.map((conv) => {
            const isSelected = activeConvId === conv.id;
            return (
              <div
                key={conv.id}
                className={`flex items-center justify-between rounded-lg py-2 px-3 group transition-all text-sm cursor-pointer ${
                  isSelected 
                    ? "bg-gray-50 text-gray-900 font-medium border border-gray-200" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => handleConversationClick(conv.id)}
              >
                <div className="flex items-center space-x-2 overflow-hidden w-full">
                  <MessageSquare className={`h-4 w-4 shrink-0 ${isSelected ? "text-emerald-600" : "text-gray-400"}`} />
                  {!isCollapsed ? (
                    <span className="truncate pr-2">{conv.title}</span>
                  ) : (
                    <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full"></div>
                  )}
                </div>

                {!isCollapsed && conversations.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-all cursor-pointer"
                    title="Delete Session"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          {!isCollapsed && conversations.length === 0 && (
            <div className="text-center py-6 px-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
              No recent chat sessions.
            </div>
          )}
        </div>
      </div>

      {/* Profile / Footer Area */}
      <div className="p-4 border-t border-gray-200 space-y-3 shrink-0 bg-gray-50/50">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-sans font-medium text-sm text-gray-900 truncate">
                {userName}
              </span>
              <span className="font-mono text-xs text-gray-500 truncate">
                {userEmail}
              </span>
            </div>
          )}
        </div>

        {/* Action controls */}
        {!isCollapsed ? (
          <div className="flex space-x-2 pt-1">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center h-8 rounded-lg bg-white text-gray-600 hover:text-gray-900 text-xs transition-colors cursor-pointer border border-gray-200 shadow-sm"
              title="Global Preferences"
            >
              <Settings className="h-3.5 w-3.5 mr-1" /> Config
            </button>
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center h-8 rounded-lg bg-red-50 hover:bg-red-100/60 text-red-600 text-xs transition-colors cursor-pointer border border-red-100"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" /> Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100/60 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
