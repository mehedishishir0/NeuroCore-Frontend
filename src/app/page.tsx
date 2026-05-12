"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  BrainCircuit, ChevronRight, Loader2, ArrowLeft, Sparkles, 
  User, Heart, MessageSquare, Zap, Activity,  ScanFace, Database, Waves
} from "lucide-react";
import { toast } from "sonner";

// --- Interfaces ---
interface Question {
  id: number;
  question_en: string;
  question_bn: string;
}

interface AnswerInput {
  questionId: number;
  answer: string;
}

export default function MindAnalyzerPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerInput[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/questions`);
        const json = await res.json();
        if (json.success) setQuestions(json.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Synaptic Link Failed: Data stream interrupted.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const getUpdatedAnswers = () => {
    const newAnswers = [...answers];
    if (currentAnswer.trim()) {
      const existingIdx = newAnswers.findIndex(a => a.questionId === questions[currentIndex].id);
      if (existingIdx > -1) {
        newAnswers[existingIdx].answer = currentAnswer;
      } else {
        newAnswers.push({ questionId: questions[currentIndex].id, answer: currentAnswer });
      }
    }
    return newAnswers;
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      toast.warning("Linguistic input required for precise mapping.");
      return;
    }
    const updated = getUpdatedAnswers();
    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      const nextSavedAns = updated.find(a => a.questionId === questions[currentIndex + 1].id);
      setCurrentAnswer(nextSavedAns ? nextSavedAns.answer : "");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const updated = getUpdatedAnswers();
      setAnswers(updated);
      setCurrentIndex(prev => prev - 1);
      const prevSavedAns = updated.find(a => a.questionId === questions[currentIndex - 1].id);
      setCurrentAnswer(prevSavedAns ? prevSavedAns.answer : "");
    }
  };

  const handleSubmit = async () => {
    const finalAnswers = getUpdatedAnswers();
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analysis/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const json = await res.json();
      // Delay for "Theatrical" AI loading feel
      setTimeout(() => {
        if (json.success) {
          setResult(json.data);
          toast.success("Cognitive Map Synchronized");
        }
        setSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error("Analysis Error:", error);
      setSubmitting(false);
      toast.error("Analysis Error: Synaptic mismatch.");
    }
  };

  const progressValue = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden flex flex-col font-sans">
      
      {/* --- Animated Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.2] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- Navbar --- */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative p-2 bg-indigo-600 rounded-lg group-hover:rotate-90 transition-transform duration-500">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tighter uppercase">Neuro<span className="text-indigo-500">Core</span></span>
              <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">System v4.2.0</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono text-slate-400">NEURAL_SERVER: ACTIVE</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        
        {/* --- Submission Loading Animation --- */}
        <AnimatePresence>
          {submitting && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-t-2 border-b-2 border-indigo-500 rounded-full"
                />
                <motion.div 
                   animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-2 border-r-2 border-l-2 border-violet-500 rounded-full"
                />
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-white animate-pulse" />
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mt-8 text-center space-y-2"
              >
                <p className="font-mono text-xs tracking-[0.5em] text-indigo-400 uppercase">Analyzing Synaptic Data</p>
                <div className="flex gap-1 justify-center">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono tracking-widest uppercase mb-4 inline-block"
              >
                Identification Protocol Initiated
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4">
                Map Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Psyche.</span>
              </h1>
            </div>

            <Card className="border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-indigo-500/50 border-t-2">
              <CardHeader className="flex flex-row justify-between items-end pb-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase">Step {currentIndex + 1} / {questions.length}</p>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                      initial={{ width: 0 }} animate={{ width: `${progressValue}%` }}
                    />
                  </div>
                </div>
                <Database className="w-4 h-4 text-slate-600" />
              </CardHeader>

              <CardContent className="p-8 md:p-12">
                {loading ? (
                  <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">Warming Up Engines...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug">
                          {questions[currentIndex]?.question_en}
                        </h2>
                        <p className="text-xl text-indigo-300/60 font-serif italic border-l-2 border-indigo-500/30 pl-4">
                          {questions[currentIndex]?.question_bn}
                        </p>
                      </div>

                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000" />
                        <Textarea 
                          className="relative min-h-[180px] bg-slate-950/60 border-white/5 rounded-2xl p-6 text-lg focus-visible:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                          placeholder="Your neural response here..."
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </CardContent>

              <CardFooter className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-between">
                <Button variant="ghost" onClick={handleBack} disabled={currentIndex === 0} className="hover:bg-white/5 text-slate-400">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  onClick={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 rounded-xl shadow-lg shadow-indigo-500/20 font-bold uppercase tracking-widest text-xs"
                >
                  {currentIndex === questions.length - 1 ? "Start Analysis" : "Next Segment"} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          /* --- ENHANCED RESULTS VIEW --- */
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto space-y-8">
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
              <div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                  <ScanFace className="text-indigo-500 w-8 h-8" /> RESULT_SYNTHESIS
                </h1>
                <p className="text-slate-500 font-mono text-xs uppercase mt-1">Classification: Subject Cognitive Profile</p>
              </div>
              {/* <div className="flex gap-3">
                 <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-white/10 hover:bg-white/5 text-black hover:text-white">New Session</Button>
                 <Button size="sm" className="bg-indigo-600 text-white px-6">Export PDF</Button>
              </div> */}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Main Analysis Bento */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { label: "Identity", val: result.result.personalityType, icon: User, color: "bg-blue-500" },
                   { label: "Emotion", val: result.result.emotionalState, icon: Heart, color: "bg-rose-500" },
                   { label: "Interaction", val: result.result.communicationStyle, icon: MessageSquare, color: "bg-emerald-500" },
                   { label: "Social Link", val: result.result.relationshipStyle, icon: Zap, color: "bg-amber-500" }
                 ].map((box, i) => (
                   <motion.div 
                    whileHover={{ y: -5 }} key={i}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md hover:border-indigo-500/40 transition-colors"
                   >
                     <div className={`w-10 h-10 rounded-xl ${box.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <box.icon className="text-white w-5 h-5" />
                     </div>
                     <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2">{box.label}</p>
                     <p className="text-slate-200 text-sm leading-relaxed">{box.val}</p>
                   </motion.div>
                 ))}

                 <div className="sm:col-span-2 p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group">
                    <Waves className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-indigo-500/10 group-hover:rotate-12 transition-transform duration-1000" />
                    <h3 className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Core Synthesis
                    </h3>
                    <p className="text-2xl font-light text-slate-100 leading-snug italic">
                      &quot;{result.result.summary}&quot;
                    </p>
                 </div>
              </div>

              {/* Metrics Sidebar */}
              <div className="space-y-6">
                <Card className="bg-slate-900/60 border-white/5 p-6 rounded-3xl">
                  <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">Neural Metrics</h3>
                  <div className="space-y-5">
                    {Object.entries(result.scores).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[10px] mb-2 font-mono">
                          <span className="text-slate-400 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-indigo-400">{(value as number)}/10</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${(value as number) * 10}%` }}
                            className="h-full bg-gradient-to-r from-indigo-600 to-violet-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-mono text-slate-300">Behavioral Forecast</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed font-mono">
                    {result.result.lifestyle}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/60 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-widest uppercase">NeuroCore Labs © 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <span className="hover:text-indigo-400 cursor-pointer">Protocol</span>
            <span className="hover:text-indigo-400 cursor-pointer">Security</span>
            <span className="hover:text-indigo-400 cursor-pointer">API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}