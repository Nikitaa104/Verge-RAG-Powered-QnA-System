import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Database,
  Cpu
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode if query params change
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "register") {
      setMode("register");
    } else if (m === "login") {
      setMode("login");
    }
  }, [searchParams]);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please provide a valid email address.");
      setLoading(false);
      return;
    }

    if (mode !== "forgot" && !password) {
      setError("Please input your password.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "forgot") {
        setTimeout(() => {
          setLoading(false);
          alert("Password reset instructions have been dispatched to: " + email);
          setMode("login");
        }, 1000);
        return;
      }
      
      const res = await api.post(mode === "register" ? "/auth/register" : "/auth/login", { email, password });
      
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.response?.data?.error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* LEFT SIDE - CLEAN PROFESSIONAL SHOWCASE */}
      <div className="hidden md:flex md:w-1/2 bg-white p-12 flex-col justify-between relative border-r border-gray-200 overflow-hidden">
        
        {/* Brand */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-gray-900">
            Verge<span className="text-emerald-600">.</span>
          </span>
        </div>

        {/* Dynamic Showcase Panel */}
        <div className="my-auto max-w-lg space-y-8 relative z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded">
              Enterprise Document Sandbox
            </span>
            <h2 className="font-display font-bold text-3xl leading-tight text-gray-900">
              The Professional Space for Document Intelligence.
            </h2>
            <p className="text-gray-500 font-light leading-relaxed text-sm">
              Verge empowers teams, quantitative researchers, and businesses to build a fully indexed, hyper-responsive private knowledge base from complex PDFs with extreme precision.
            </p>
          </motion.div>

          {/* Bullet Points */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-start space-x-3.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Grounded Vector Ingestion</h4>
                <p className="text-xs text-gray-500 font-light">Data indices are strictly isolated and anchored to your secure profile.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Instant Structure Extraction</h4>
                <p className="text-xs text-gray-500 font-light">Slices layouts intelligently, preserving nested tabular and multi-column hierarchies.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <Terminal className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Citations & Groundedness First</h4>
                <p className="text-xs text-gray-500 font-light">Every single synthesised sentence maps directly back to the original page coordinates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>Verge Intelligence Console</span>
          <span>v2.6.0 Stable</span>
        </div>
      </div>

      {/* RIGHT SIDE - AUTH FORMS */}
      <div className="flex-1 p-6 md:p-12 lg:p-24 flex flex-col justify-center items-center relative z-10 bg-gray-50">
        
        {/* Mobile Header (Brand) */}
        <div className="md:hidden flex items-center space-x-2 absolute top-6 left-6 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-gray-900">Verge.</span>
        </div>

        <div className="w-full max-w-md p-[2px] rounded-[2rem] bg-gradient-to-tr from-[#FF007F] via-[#7B2CBF] to-[#00E676] shadow-xl">
          <div className="bg-white rounded-[1.92rem] p-8 md:p-10 text-left space-y-6">
            {/* Top pill badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-[#E2F8EE] bg-[#ECFDF5] text-[#00A852] text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#00A852]"></span>
                <span>
                  {mode === "login" && "Registrations Open"}
                  {mode === "register" && "Console Sandboxes Active"}
                  {mode === "forgot" && "Recovery Active"}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center">
              <h2 className="font-display text-[1.125rem] md:text-[1.25rem] font-bold text-gray-800 tracking-tight leading-snug">
                {mode === "login" && "Join the Biggest Document Intelligence Network"}
                {mode === "register" && "Deploy Your Sovereign Research Sandbox"}
                {mode === "forgot" && "Restore Access to Your Ingested Nodes"}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#BCA3A3]" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] placeholder-[#BCA3A3] text-sm text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#BCA3A3]" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] placeholder-[#BCA3A3] text-sm text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-[#8A7A7A] uppercase tracking-wider block">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-[#00A852] hover:text-[#009447] hover:underline cursor-pointer font-semibold"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#BCA3A3]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#F3EBEB] bg-[#FAF5F5] placeholder-[#BCA3A3] text-sm text-gray-800 focus:ring-2 focus:ring-[#00A852]/20 focus:border-[#00A852] outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-[#00A852] hover:bg-[#009447] text-white font-bold active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(0,168,82,0.3)] text-base"
              >
                <span>{loading ? "Verifying..." : mode === "login" ? "Login to Register" : mode === "register" ? "Create Sandbox Credentials" : "Send Recovery Link"}</span>
                {!loading && <ArrowRight className="h-4.5 w-4.5" />}
              </button>

              <p className="text-[10px] md:text-xs text-[#BCA3A3] text-center font-medium mt-4">
                By registering, you agree to Verge's Terms & Privacy Policy.
              </p>
            </form>

            {/* Switch Modes */}
            <div className="text-center pt-4 border-t border-gray-100 mt-4">
              {mode === "login" && (
                <span className="text-xs text-gray-500">
                  New to Verge?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[#00A852] hover:text-[#009447] hover:underline font-semibold cursor-pointer"
                  >
                    Create account
                  </button>
                </span>
              )}

              {mode === "register" && (
                <span className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#00A852] hover:text-[#009447] hover:underline font-semibold cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}

              {mode === "forgot" && (
                <span className="text-xs text-gray-500">
                  Remembered your details?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#00A852] hover:text-[#009447] hover:underline font-semibold cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
