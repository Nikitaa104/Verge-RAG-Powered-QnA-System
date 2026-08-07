import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Database, 
  Cpu, 
  Check, 
  ShieldCheck, 
  Network, 
  Zap, 
  Plus, 
  Minus,
  MessageSquare,
  FileText
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Network,
      title: "Layout-Aware Parsing",
      description: "Verge parses complex tables, multi-column articles, and hierarchical sections natively without context dilution."
    },
    {
      icon: Cpu,
      title: "Dynamic Smart Chunking",
      description: "Splits texts intelligently using syntactic boundaries. Automatically pairs nested search clusters to parent nodes."
    },
    {
      icon: Search,
      title: "Hybrid Reciprocal Fusion",
      description: "Melds sparse keyword search (BM25) with high-density similarity search (Gemini) to fetch exact text coordinates."
    },
    {
      icon: Zap,
      title: "Cross-Encoder Reranking",
      description: "Evaluates extracted candidates directly against prompts, filtering noise and curing 'lost-in-the-middle' context dropout."
    },
    {
      icon: Database,
      title: "Semantic Citation Mapping",
      description: "Generated answers are paired with reference coordinates. Click references to inspect the original text chunks."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Data Guard",
      description: "Documents are securely isolated, encrypted at rest, and strictly omitted from foundational model public training pools."
    }
  ];

  const faqs = [
    {
      question: "What makes Verge RAG different from basic document queries?",
      answer: "Standard LLM queries have strict context windows or index files via naive keyword matches. Verge implements a multi-stage layout extraction pipeline. It preserves nested tables, splits sections into hierarchical parent-child nodes, fuses vector matching with BM25 keyword rankings, and filters noise via cross-encoder rerankers to ensure extremely high precision and clear citations."
    },
    {
      question: "What file formats does Verge support?",
      answer: "We support high-density PDFs, Microsoft Word files (.docx), Markdowns (.md), JSON documents, CSV data sheets, and plain-text files (.txt). All uploaded documents are indexed securely on your sandbox node."
    },
    {
      question: "Is my corporate document data secure?",
      answer: "Security is our highest standard. All uploaded content is sandbox-isolated and protected via AES-256 encryption. We enforce a zero-sharing policy: your research and document data are never sent to external training datasets."
    },
    {
      question: "Can I connect my own cloud repositories or databases?",
      answer: "Yes. While Verge provides a clean localized sandbox interface for quick exploration, enterprise teams can sync directly with private Google Drive folders, AWS S3 storage buckets, and secure PostgreSQL databases."
    }
  ];

  const plans = [
    {
      name: "Lite",
      price: "$0",
      description: "Explore the capabilities of layout-aware document intelligence with zero setup.",
      features: [
        "Up to 5 custom documents",
        "Max 15MB file upload limit",
        "Sovereign response engine",
        "Standard vector matching pipeline",
        "Interactive citations tracker",
      ],
      cta: "Try Free Now",
      accent: false,
    },
    {
      name: "Verge Pro",
      price: "$29",
      period: "/ month",
      description: "Advanced pipelines engineered for developers, researchers, and professional teams.",
      features: [
        "Unlimited custom documents",
        "Max 100MB file upload limit",
        "Advanced layout-aware PDF parser",
        "Cross-Encoder reranking filters",
        "Interactive citation coordinate maps",
        "Priority queue indexing logs"
      ],
      cta: "Deploy Pro Sandbox",
      accent: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations requiring custom schemas, dedicated server nodes, and full security SLAs.",
      features: [
        "Isolated virtual private server nodes",
        "Fully private vector embeddings",
        "99.99% uptime guarantee SLA",
        "Custom parser custom schemas",
        "Personalized onboarding & support",
        "Team activity dashboard logs"
      ],
      cta: "Request Demo",
      accent: false,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden relative">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-20 pb-16 mx-auto max-w-7xl flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 font-mono mb-6 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Document Intelligence RAG Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-6xl leading-tight tracking-tight text-gray-900 max-w-4xl"
        >
          Connect Your Research. <br />
          Synthesize <span className="text-emerald-600">Grounded Knowledge.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl font-light leading-relaxed"
        >
          Verge is the clean professional space where research layouts meet precise RAG. Ingest files, index coordinates, and retrieve cited responses with zero context loss.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate("/auth")}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all cursor-pointer shadow-sm text-sm"
          >
            <span>Launch Verge Console</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all cursor-pointer shadow-sm text-sm"
          >
            <span>Explore Pipeline</span>
          </a>
        </motion.div>

        {/* Console Demo Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-4 shadow-md text-left"
        >
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
            <div className="flex space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/70"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400/70"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-400/70"></div>
            </div>
            <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded border border-gray-200">
              <MessageSquare className="h-3 w-3 text-emerald-600" /> console.verge.ai/chat/financial_spec
            </div>
            <div className="w-12"></div>
          </div>

          {/* Mock Main Layout split screen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[380px] text-left">
            {/* Sidebar item */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col space-y-3">
              <div className="text-[10px] font-mono font-bold text-emerald-700 tracking-wider uppercase">Active Contexts</div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2 p-2 rounded bg-emerald-50 border border-emerald-200">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-900 truncate">Q4_Report_2025.pdf</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100/60 transition-colors">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">Sovereign_Capabilities.pdf</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100/60 transition-colors">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">Index_Design_Patterns.csv</span>
                </div>
              </div>
              <div className="p-2 border border-dashed border-gray-200 rounded text-center text-[10px] text-gray-400 font-bold hover:text-emerald-600 cursor-pointer bg-white transition-all">
                + Ingest New PDF
              </div>
            </div>

            {/* Chat preview screen */}
            <div className="col-span-2 border border-gray-200 rounded-lg p-4 bg-white flex flex-col justify-between">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex flex-col space-y-1">
                  <div className="text-[10px] font-mono text-emerald-700 font-bold">USER_QUESTION</div>
                  <div className="text-xs bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 text-gray-800 font-medium">
                    What is the summarized vector layout for Verge's cross-encoder reranker?
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <div className="text-[10px] font-mono text-gray-500 font-bold flex items-center gap-1">
                    VERGE_INTELLIGENCE <Sparkles className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div className="text-xs border border-gray-200 bg-gray-50 rounded-lg p-3 text-gray-700 space-y-2">
                    <p>Verge utilizes a dual-engine architecture to query documents:</p>
                    <p>1. **Hybrid Ingestion** combines sparse indexing with dense vector clusters [1].</p>
                    <p>2. **Cross-Encoder Filtering** evaluates the top 20 candidates, reorganizing records according to strict prompt matching coordinates.</p>
                  </div>
                </div>

                {/* Citation Preview */}
                <div className="flex items-center space-x-2 p-2 rounded border border-emerald-200 bg-emerald-50/50 max-w-sm">
                  <span className="text-[9px] bg-emerald-600 text-white rounded px-1.5 py-0.5 font-bold">Citation 1</span>
                  <span className="text-[10px] font-mono text-gray-600 font-semibold">Section 4.1 · Page 12 · Match: 98%</span>
                </div>
              </div>

              {/* Chat bottom bar */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-150">
                <div className="flex-1 h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 flex items-center text-xs text-gray-400 font-medium">
                  Ask Verge a question...
                </div>
                <div className="h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white cursor-pointer transition-colors shadow-sm">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. METRIC BANNER */}
      <section className="border-y border-gray-200 py-12 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col space-y-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-emerald-600">2M+</span>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Context Tokens Capacity</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-emerald-600">96.8%</span>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Grounded Accuracy Index</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-emerald-600">&lt; 1.5s</span>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Ingestion Chunking Rate</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-emerald-600">100%</span>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Isolated Tenant Security</span>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="px-6 py-20 mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded border border-emerald-150">Pipeline Architecture</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mt-4 text-gray-900">Advanced Grounded Ingestion</h2>
          <p className="mt-3 text-gray-500 font-light text-sm md:text-base">Traditional RAG splits technical layout coordinates blindly, diluting semantic relevance. Verge organizes and synthesises document chunks correctly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-emerald-600 transition-all flex flex-col justify-between h-60 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 mb-6 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-gray-950 mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. RAG PIPELINE DIAGRAM */}
      <section className="px-6 py-16 bg-white border-t border-b border-gray-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Diagram Explainer */}
            <div className="text-left space-y-5">
              <span className="text-xs font-mono text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded border border-emerald-150 font-bold">Retrieval Cycle</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900">Full-Spectrum Vector Alignment</h2>
              <p className="text-gray-500 font-light text-xs md:text-sm leading-relaxed">
                When you initiate a query inside Verge, the local node launches a strict, pipeline-guided verification cycle. Your PDF is extracted preserving multi-column coordinates, parsed into parent-child clusters, and matched using fused Reciprocal Rank indexes. A local Cross-Encoder reranks coordinates before synthesising the response with clear page coordinate tags.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="mt-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-gray-600"><strong className="text-gray-900 font-semibold">Hierarchy preservation</strong>: Retains complex nested matrices natively.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="mt-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-gray-600"><strong className="text-gray-900 font-semibold">Coordinate citation maps</strong>: Sentinel page tracking references coordinates.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="mt-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-gray-600"><strong className="text-gray-900 font-semibold">Model isolation guardrails</strong>: Complete sandbox limits model dataset leaks.</span>
                </div>
              </div>
            </div>

            {/* Interactive Illustration of RAG Pipeline */}
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden shadow-sm">
              <svg viewBox="0 0 450 360" className="w-full max-w-md text-gray-500">
                {/* PDF Icon / Source Block */}
                <g transform="translate(40, 50)">
                  <rect x="0" y="0" width="70" height="50" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
                  <text x="35" y="24" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PDF Ingest</text>
                  <line x1="12" y1="36" x2="58" y2="36" stroke="#059669" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="12" y1="41" x2="45" y2="41" stroke="#059669" strokeWidth="1" strokeOpacity="0.2" />
                </g>

                {/* Arrow 1 */}
                <path d="M 115 75 L 155 75" stroke="#059669" strokeWidth="1.2" markerEnd="url(#arrow)" strokeDasharray="2 2" />

                {/* Parsing / Vector block */}
                <g transform="translate(165, 30)">
                  <rect x="0" y="0" width="90" height="90" rx="6" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
                  <text x="45" y="25" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Dense Vector</text>
                  <text x="45" y="40" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="monospace">PGVector Embedded</text>
                  <text x="45" y="60" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="sans-serif">& BM25 Sparse</text>
                  <text x="45" y="75" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="monospace">Reciprocal Fusion</text>
                </g>

                {/* Arrow 2 */}
                <path d="M 260 75 L 295 75" stroke="#059669" strokeWidth="1.2" />

                {/* Cross-Encoder Reranker block */}
                <g transform="translate(305, 50)">
                  <rect x="0" y="0" width="95" height="50" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
                  <text x="47" y="24" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Cross-Encoder</text>
                  <text x="47" y="38" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="monospace">Top-10 Sliced Chunks</text>
                </g>

                {/* Vertical lines connecting to Generator */}
                <path d="M 352 105 L 352 180 L 255 180" stroke="#059669" strokeWidth="1.2" />
                <path d="M 75 105 L 75 180 L 155 180" stroke="#059669" strokeWidth="1.2" />

                {/* Prompt generator in center */}
                <g transform="translate(165, 150)">
                  <rect x="0" y="0" width="80" height="60" rx="6" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.2" />
                  <text x="40" y="26" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Context Nodes</text>
                  <text x="40" y="42" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="monospace">XML Structural Map</text>
                </g>

                {/* Arrow down from builder */}
                <path d="M 205 215 L 205 245" stroke="#9CA3AF" strokeWidth="1.2" />

                {/* Synthesis bottom */}
                <g transform="translate(145, 255)">
                  <rect x="0" y="0" width="120" height="60" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
                  <text x="60" y="28" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Sovereign Synthesis</text>
                  <text x="60" y="44" textAnchor="middle" fill="#065F46" fontSize="8" fontFamily="monospace">Grounded citation maps [1]</text>
                </g>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
                  </marker>
                </defs>
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="px-6 py-20 mx-auto max-w-7xl text-center">
        <div className="max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded border border-emerald-150">Sandbox Scaling</span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mt-4 text-gray-900">Secure Transparent Plans</h2>
          <p className="mt-3 text-gray-500 font-light">Simple computational limits. Select a tier matching your quantitative volume.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-7 rounded-lg border text-left flex flex-col justify-between transition-all relative ${
                plan.accent 
                  ? "bg-white border-emerald-500 shadow-md" 
                  : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
            >
              {plan.accent && (
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                  Highly Recommended
                </div>
              )}
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 font-light mt-1.5 min-h-[32px]">{plan.description}</p>
                
                <div className="flex items-baseline mt-4 mb-6">
                  <span className="font-display text-4xl font-bold text-gray-950">{plan.price}</span>
                  {plan.period && <span className="text-xs text-gray-400 font-mono ml-1 font-semibold">{plan.period}</span>}
                </div>

                <div className="border-t border-gray-150 pt-5 space-y-3 mb-6">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-gray-600 font-light">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/auth")}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer text-center shadow-sm ${
                  plan.accent 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="px-6 py-20 mx-auto max-w-3xl border-t border-gray-200">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded border border-emerald-150">Verification Center</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-4 text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="rounded-lg border border-gray-200 bg-white p-4.5 shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-gray-900 font-semibold hover:text-emerald-600 transition-colors cursor-pointer text-sm"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-emerald-600 shrink-0" /> : <Plus className="h-4 w-4 text-emerald-600 shrink-0" />}
                </button>
                
                {isOpen && (
                  <div className="mt-3 text-xs text-gray-500 font-light leading-relaxed border-t border-gray-150 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="px-6 py-16 mx-auto max-w-4xl text-center border border-emerald-150 bg-emerald-50/50 rounded-xl mb-20 shadow-sm">
        <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1 rounded font-bold">Deploy Sandbox Node</span>
        <h2 className="font-display font-bold text-3xl text-gray-950 mt-4">Upgrade your research workflows today.</h2>
        <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-lg mx-auto font-light leading-relaxed">Ingest corporate records, activate reciprocal vector parsing, and retrieve precise grounded outputs immediately.</p>
        <button
          onClick={() => navigate("/auth")}
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-sm text-xs transition-colors"
        >
          <span>Activate Sandbox Console</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-gray-200 py-10 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400 font-medium">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-sm">Verge.</span>
          </div>
          <div className="text-gray-500 font-light">
            © 2026 Verge Inc. All rights reserved. Precision document intelligence sandboxes.
          </div>
          <div className="flex space-x-5 text-[11px] font-mono font-semibold text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">SLA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
