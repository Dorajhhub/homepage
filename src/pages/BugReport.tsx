import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bug, 
  Mail, 
  ChevronLeft, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface BugItem {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Fixed";
  date: string;
}

const BugReport = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/bugs.json`)
      .then((res) => res.json())
      .then((data) => {
        setBugs(data.bugs);
      })
      .catch((err) => console.error("Error fetching bugs:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Fixed": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "In Progress": return <Clock className="w-5 h-5 text-amber-400" />;
      default: return <AlertCircle className="w-5 h-5 text-rose-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Fixed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Progress": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full top-[-10%] right-[-10%] bg-indigo-500/10 blur-[120px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-5%] left-[-5%] bg-rose-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 py-8 mx-auto max-w-7xl">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors text-slate-400 hover:text-indigo-400 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          돌아가기
        </button>

        {/* Hero Section */}
        <div className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 p-1 border border-white/10 shadow-2xl">
          <div className="relative bg-[#0f172a] rounded-[2.4rem] p-10 md:p-16 overflow-hidden">
            <div className="absolute w-64 h-64 rounded-full -top-24 -right-24 bg-rose-500/5 blur-3xl animate-pulse" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="p-4 mb-8 bg-rose-500/10 rounded-3xl"
              >
                <Bug className="w-12 h-12 text-rose-400" />
              </motion.div>
              <h1 className="mb-6 text-4xl font-black tracking-tighter md:text-6xl text-white">
                버그 제보 센터
              </h1>
              <p className="max-w-2xl mb-10 text-lg font-light leading-relaxed text-slate-400 md:text-xl">
                더 나은 서비스를 위해 발견하신 버그를 알려주세요. <br />
                확인 후 신속히 수정하도록 하겠습니다.
              </p>
              
              <div className="flex flex-col items-center gap-6 p-8 border bg-white/5 backdrop-blur-md border-white/10 rounded-3xl w-full max-w-lg">
                <div className="flex items-center gap-3 text-rose-400">
                  <Mail className="w-6 h-6" />
                  <span className="text-xl font-bold">jihukwak12@gmail.com</span>
                </div>
                <p className="text-sm text-slate-500">
                  버그 내용, 발생 경로, 스크린샷 등을 포함하여 이메일로 보내주시면 큰 도움이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Known Bugs Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <AlertCircle className="text-indigo-400" />
              확인된 버그 목록
            </h2>
            <div className="text-sm text-slate-500">
              총 {bugs.length}건
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-48 border border-white/5 bg-white/5 rounded-3xl animate-pulse" />
              ))
            ) : bugs.length > 0 ? (
              bugs.map((bug) => (
                <motion.div
                  key={bug.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 transition-all border border-white/5 bg-white/5 hover:bg-white/10 rounded-3xl group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusClass(bug.status)}`}>
                      {getStatusIcon(bug.status)}
                      {bug.status}
                    </span>
                    <span className="text-xs text-slate-500">{bug.date}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {bug.title}
                  </h3>
                  <p className="text-slate-400 font-light leading-relaxed">
                    {bug.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-20 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500">현재 확인된 버그가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 p-10 text-center border border-white/5 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="mb-4 text-xl font-bold">감사합니다</h3>
          <p className="text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            여러분의 적극적인 제보가 더 쾌적한 지후컴퍼니 게임 환경을 만듭니다. 
            모든 제보는 소중하게 검토하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BugReport;
