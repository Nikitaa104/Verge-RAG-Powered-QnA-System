import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Cpu, Menu, X, ArrowRight, Github } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  userEmail?: string;
}

export default function Navbar({ isAuthenticated = false, onLogout, userEmail }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-sm group-hover:bg-emerald-700 transition-colors duration-300">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-gray-900">
            Verge<span className="text-emerald-600">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-sans text-sm font-medium transition-colors duration-200 ${
              isActive("/") ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <a
            href="#features"
            className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            FAQ
          </a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <Github className="h-5 w-5" />
          </a>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-gray-500 border border-gray-200 px-2.5 py-1 rounded bg-gray-50">
                {userEmail}
              </span>
              <button
                onClick={handleDashboardClick}
                className="flex items-center space-x-2 px-4 h-10 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 cursor-pointer text-sm shadow-sm"
              >
                <span>Console</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 h-10 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100/50 hover:border-red-300 transition-all duration-300 cursor-pointer text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors duration-200"
              >
                Sign In
              </Link>
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="flex items-center space-x-2 px-5 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          {isAuthenticated && (
            <button
              onClick={handleDashboardClick}
              className="text-xs font-mono text-emerald-700 border border-emerald-200 px-2 py-1 rounded bg-emerald-50"
            >
              Console
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            FAQ
          </a>

          <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <span className="text-xs font-mono text-gray-500 px-3">{userEmail}</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleDashboardClick();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                >
                  <span>Dashboard Console</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout?.();
                  }}
                  className="w-full py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium hover:bg-red-100/50 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
