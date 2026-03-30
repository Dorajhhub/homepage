import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Heart,
  Star,
  Share2,
  Calendar,
  Gift as GiftIcon,
  MessageCircle,
  Send,
  Trash2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import * as THREE from "three";
import { createClient } from "@supabase/supabase-js";

// Supabase 설정 (본인의 Supabase 프로젝트 설정에 맞게 변경해주세요)
const supabaseUrl = "https://ybmczzcuxyxxfazuesjs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibWN6emN1eHl4eGZhenVlc2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTM2MzEsImV4cCI6MjA4ODYyOTYzMX0.aBVuwjqAd-mlTOZy7lvL_Mt6kFTD0bm1q_kDefZHxNQ";
const supabase = createClient(supabaseUrl, supabaseKey);

interface BirthdayMessage {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

// 입력 폼 최적화를 위한 별도 컴포넌트 (React.memo 사용으로 렌더링 분리)
const MessageForm = React.memo(
  ({
    onSend,
    isSending,
  }: {
    onSend: (author: string, content: string) => Promise<boolean>;
    isSending: boolean;
  }) => {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!author.trim() || !content.trim() || isSending) return;

      const success = await onSend(author, content);
      if (success) {
        setContent(""); // 전송 성공 시에만 내용 초기화
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임"
            maxLength={50}
            className="w-full px-4 py-3 text-white transition-all border outline-none md:w-1/3 rounded-xl bg-white/5 border-white/10 focus:border-pink-400 placeholder-white/40"
          />
          <div className="flex w-full gap-2 md:flex-1">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="축하 메시지를 남겨주세요 (300자)"
              maxLength={300}
              className="flex-1 px-4 py-3 text-white transition-all border outline-none rounded-xl bg-white/5 border-white/10 focus:border-pink-400 placeholder-white/40"
            />
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center justify-center p-3 text-white transition-colors bg-pink-500 rounded-xl hover:bg-pink-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="text-xs text-right text-white/40">
          {content.length}/300
        </div>
      </form>
    );
  },
);

const MESSAGES_PER_PAGE = 5;

const BirthdayPage: React.FC = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminNotification, setAdminNotification] = useState<string | null>(
    null,
  );
  const [loginLogId, setLoginLogId] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [candles, setCandles] = useState([true, true, true]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [wishes, setWishes] = useState<string[]>([]);
  const [currentWish, setCurrentWish] = useState("");
  const [showFireworks, setShowFireworks] = useState(false);
  const [confetti, setConfetti] = useState<
    { id: number; x: number; color: string }[]
  >([]);
  const [balloons, setBalloons] = useState<
    { id: number; x: number; emoji: string }[]
  >([]);
  const [touchParticles, setTouchParticles] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);
  const [showReminder, setShowReminder] = useState(false);
  const [reminders, setReminders] = useState<{ name: string; date: string }[]>(
    [],
  );
  const [newReminder, setNewReminder] = useState({ name: "", date: "" });
  const [show3DCake, setShow3DCake] = useState(false);
  const [mysteryBoxes, setMysteryBoxes] = useState([
    {
      id: 1,
      opened: false,
      message: "💝 건강하고 행복한 한 해 되길!",
      emoji: "💝",
    },
    { id: 2, opened: false, message: "🌟 올해는 꿈을 이루는 해!", emoji: "🌟" },
    {
      id: 3,
      opened: false,
      message: "🎂 생일 축하해!",
      emoji: "🎂",
    },
  ]);
  const [showMysteryBoxes, setShowMysteryBoxes] = useState(false);
  const [messages, setMessages] = useState<BirthdayMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [deleteMsgId, setDeleteMsgId] = useState<string | null>(null);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti 효과
  useEffect(() => {
    if (isUnlocked) {
      const interval = setInterval(() => {
        const colors = ["#FFD700", "#FF69B4", "#9370DB", "#00CED1", "#FF1493"];
        const newConfetti = Array.from({ length: 10 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setConfetti((prev) => [...prev.slice(-30), ...newConfetti]); // 성능 최적화를 위해 개수 및 보관량 제한
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  // 풍선 효과
  useEffect(() => {
    if (isUnlocked) {
      const interval = setInterval(() => {
        const emojis = ["🎈", "🎀", "🎁", "⭐", "💝"];
        setBalloons((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
          },
        ]);
      }, 3000); // 생성 간격 늘림
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  // Admin 알림 리스너 (Supabase Realtime 사용)
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("login-notification")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "login_logs" },
        (payload) => {
          setAdminNotification("🔔 누군가 120320로 접속했습니다!");
          setTimeout(() => setAdminNotification(null), 4000);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // 120320 유저 퇴장 시 로그 삭제
  useEffect(() => {
    const deleteLog = async () => {
      if (loginLogId) {
        await supabase.from("login_logs").delete().eq("id", loginLogId);
      }
    };

    const handleBeforeUnload = () => {
      deleteLog();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      deleteLog();
    };
  }, [loginLogId]);

  // 메시지 로드 및 실시간 구독
  useEffect(() => {
    if (!isUnlocked) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      const { data } = await supabase
        .from("birthday_messages")
        .select("*")
        .order("created_at", { ascending: sortOrder === "oldest" })
        .range(0, MESSAGES_PER_PAGE - 1);

      if (data) {
        setMessages(data);
        setMessagesPage(1);
        setHasMoreMessages(data.length >= MESSAGES_PER_PAGE);
      }
      setIsLoadingMessages(false);
    };

    fetchMessages();

    const channel = supabase
      .channel("birthday_messages_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "birthday_messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // 최신순 정렬일 때만 실시간으로 맨 위에 추가
            if (sortOrder === "newest") {
              setMessages((prev) => {
                // 중복 추가 방지
                if (
                  prev.some(
                    (msg) => msg.id === (payload.new as BirthdayMessage).id,
                  )
                ) {
                  return prev;
                }
                return [payload.new as BirthdayMessage, ...prev];
              });
            }
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isUnlocked, sortOrder]);

  // Realtime Connection Error Handling
  useEffect(() => {
    if (!isUnlocked) return;

    const realtimeClient = supabase.realtime;

    const onError = (error: any) => {
      console.error("Realtime connection error:", error);
      setShowConnectionError(true);
      // Disconnect to prevent the client's automatic reconnection attempts
      realtimeClient.disconnect();
    };

    const onOpen = () => {
      console.log("Realtime connection established.");
      setShowConnectionError(false);
    };

    // Add listeners for connection events
    realtimeClient.stateChangeCallbacks.error.push(onError);
    realtimeClient.stateChangeCallbacks.open.push(onOpen);

    return () => {
      // Cleanup: remove listeners to avoid memory leaks
      realtimeClient.stateChangeCallbacks.error =
        realtimeClient.stateChangeCallbacks.error.filter(
          (cb) => cb !== onError,
        );
      realtimeClient.stateChangeCallbacks.open =
        realtimeClient.stateChangeCallbacks.open.filter((cb) => cb !== onOpen);
    };
  }, [isUnlocked]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === "admin") {
      setIsUnlocked(true);
      setIsAdmin(true);
      setTimeout(() => setShowFireworks(true), 1000);
    } else if (inputPassword === "120320") {
      setIsUnlocked(true);
      setIsAdmin(false);
      setTimeout(() => setShowFireworks(true), 1000);
      // Supabase에 접속 로그 저장
      const { data } = await supabase
        .from("login_logs")
        .insert([{ message: "120320_LOGIN" }])
        .select();

      if (data && data[0]) {
        setLoginLogId(data[0].id);
      }
    } else {
      setError(true);
      setInputPassword("");
    }
  };

  const toggleCandle = (index: number) => {
    const newCandles = [...candles];
    newCandles[index] = !newCandles[index];
    setCandles(newCandles);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const addWish = () => {
    if (currentWish.trim()) {
      setWishes([...wishes, currentWish]);
      setCurrentWish("");
    }
  };

  // 터치 파티클
  const handleTouch = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX = 0,
      clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const emojis = ["✨", "💫", "⭐", "🌟", "💖", "🎉", "🎊"];
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: clientX,
      y: clientY,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setTouchParticles((prev) => [...prev.slice(-20), ...newParticles]);
  };

  // 리마인더 추가
  const addReminder = () => {
    if (newReminder.name && newReminder.date) {
      setReminders([...reminders, newReminder]);
      setNewReminder({ name: "", date: "" });
    }
  };

  // 미스터리 박스 열기
  const openMysteryBox = (id: number) => {
    setMysteryBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, opened: true } : box)),
    );
  };

  // 공유하기
  const handleShare = async () => {
    const shareData = {
      title: "🎉 생일 축하해! 🎂",
      text: "특별한 생일 축하 페이지를 만들었어요!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("공유 취소됨");
      }
    } else {
      // Fallback: 링크 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다! 📋");
    }
  };

  const handleReconnect = () => {
    setShowConnectionError(false);
    // Manually attempt to reconnect. The client handles internal state.
    supabase.realtime.connect();
  };

  const handleSendMessage = async (author: string, content: string) => {
    setIsSending(true);

    const { error } = await supabase.rpc("send_birthday_message", {
      p_author: author,
      p_content: content,
      p_emoji: "",
    });

    setIsSending(false);

    if (!error) {
      return true;
    } else {
      alert("메시지 전송에 실패했습니다.");
      return false;
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoadingMessages) return;

    setIsLoadingMessages(true);
    const from = messagesPage * MESSAGES_PER_PAGE;
    const to = from + MESSAGES_PER_PAGE - 1;

    const { data } = await supabase
      .from("birthday_messages")
      .select("*")
      .order("created_at", { ascending: sortOrder === "oldest" })
      .range(from, to);

    if (data) {
      setMessages((prev) => [...prev, ...data]);
      setMessagesPage((prev) => prev + 1);
      if (data.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }
    }

    setIsLoadingMessages(false);
  };

  const confirmDelete = async () => {
    if (!deleteMsgId || !isAdmin) return;

    const { error } = await supabase
      .from("birthday_messages")
      .delete()
      .eq("id", deleteMsgId);

    if (error) {
      console.error("Error deleting message:", error);
      alert("삭제 실패");
    }
    setDeleteMsgId(null);
  };

  const allCandlesOff = candles.every((c) => !c);

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: -10,
                opacity: Math.random(),
              }}
              animate={{
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight + 10
                    : 1000,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="relative z-10 w-full max-w-md p-8 border shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-6 text-6xl text-center"
          >
            🎁
          </motion.div>

          <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            🔒 Special Invitation
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError(false);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                placeholder="Enter the secret code..."
                className="w-full px-4 py-4 text-white transition-all border outline-none rounded-xl bg-white/5 border-white/10 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 placeholder-white/40"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-rose-400"
                >
                  <span>❌</span> 비밀번호가 일치하지 않습니다.
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className="w-full py-4 font-bold text-white rounded-xl bg-gradient-to-r from-pink-500 to-purple-500"
            >
              ✨ Unlock Birthday Magic ✨
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
      {/* Connection Error Modal */}
      <AnimatePresence>
        {showConnectionError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="w-full max-w-md p-8 text-center border shadow-2xl bg-gray-800/80 backdrop-blur-xl rounded-3xl border-white/30"
            >
              <h3 className="mb-4 text-2xl font-bold text-red-400">
                🔌 네트워크 연결 오류
              </h3>
              <p className="mb-6 text-white/80">
                실시간 서버에 연결할 수 없습니다.
                <br />
                네트워크 상태를 확인하고 다시 시도해주세요.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReconnect}
                className="w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-500"
              >
                재연결
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 커스텀 모달 (window.confirm 대체) */}
      <AnimatePresence>
        {deleteMsgId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteMsgId(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-sm p-6 text-center bg-gray-800 border shadow-2xl rounded-2xl border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-xl font-bold text-white">
                정말 삭제하시겠습니까?
              </h3>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDeleteMsgId(null)}
                  className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-500"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Notification */}
      <AnimatePresence>
        {adminNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 z-[100] px-6 py-3 font-bold text-white bg-red-500/90 backdrop-blur-md rounded-full shadow-lg"
          >
            {adminNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${c.x}%`,
              backgroundColor: c.color,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: typeof window !== "undefined" ? window.innerHeight : 1000,
              opacity: 0,
              rotate: 360,
            }}
            transition={{ duration: 3, ease: "linear" }}
            onAnimationComplete={() => {
              setConfetti((prev) => prev.filter((conf) => conf.id !== c.id));
            }}
          />
        ))}
      </div>

      {/* 풍선 */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${b.x}%` }}
          initial={{
            y: typeof window !== "undefined" ? window.innerHeight + 50 : 1000,
            rotate: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
          }}
          transition={{ duration: 8, ease: "linear" }}
          onAnimationComplete={() => {
            setBalloons((prev) => prev.filter((bal) => bal.id !== b.id));
          }}
        >
          {b.emoji}
        </motion.div>
      ))}

      {/* 터치 파티클 */}
      {touchParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl pointer-events-none"
          style={{ left: p.x, top: p.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: 2,
            opacity: 0,
            y: -100,
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => {
            setTouchParticles((prev) => prev.filter((tp) => tp.id !== p.id));
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* 컨트롤 버튼들 */}
      <div className="absolute z-50 flex gap-3 top-6 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleMusic();
          }}
          className="p-3 text-white transition-colors rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          {isPlaying ? <Volume2 /> : <VolumeX />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowWish(!showWish);
          }}
          className="p-3 text-white transition-colors rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <Heart />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowReminder(!showReminder);
          }}
          className="p-3 text-white transition-colors rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <Calendar />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="p-3 text-white transition-colors rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <Share2 />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowMysteryBoxes(!showMysteryBoxes);
          }}
          className="p-3 text-white transition-colors rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <GiftIcon />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-4xl p-6 text-center"
      >
        {/* 케이크와 촛불 */}
        <div className="flex items-end justify-center mb-6 space-x-2 select-none">
          {candles.map((isOn, index) => (
            <motion.div
              key={`left-${index}`}
              animate={isOn ? { y: [0, -10, 0] } : {}}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              className="relative text-4xl transition-transform cursor-pointer hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                toggleCandle(index);
              }}
              whileHover={{ rotate: [0, -15, 15, 0] }}
            >
              {isOn ? (
                <>
                  🕯️
                  <motion.div
                    className="absolute top-0 text-xs -translate-x-1/2 left-1/2"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    ✨
                  </motion.div>
                </>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  💨
                </motion.span>
              )}
            </motion.div>
          ))}

          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: allCandlesOff ? [1, 1.2, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mx-2 cursor-pointer text-7xl"
            onClick={(e) => {
              //e.stopPropagation();
              //setShow3DCake(!show3DCake);
            }}
          >
            🎂
          </motion.div>

          {candles.map((isOn, index) => (
            <motion.div
              key={`right-${index}`}
              animate={isOn ? { y: [0, -10, 0] } : {}}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                delay: (index + 3) * 0.2,
              }}
              className="relative text-4xl transition-transform cursor-pointer hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                toggleCandle(index);
              }}
              whileHover={{ rotate: [0, -15, 15, 0] }}
            >
              {isOn ? (
                <>
                  🕯️
                  <motion.div
                    className="absolute top-0 text-xs -translate-x-1/2 left-1/2"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    ✨
                  </motion.div>
                </>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  💨
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* 3D 케이크 모달 */}
        <AnimatePresence>
          {show3DCake && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShow3DCake(false);
              }}
            ></motion.div>
          )}
        </AnimatePresence>

        {/* 타이틀 */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mb-2 text-4xl font-black text-white md:text-6xl drop-shadow-lg"
        >
          <motion.span
            animate={{ color: ["#fff", "#ffd700", "#ff69b4", "#fff"] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            Happy Birthday! 🎉
          </motion.span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8 text-xl font-bold text-white/90 md:text-3xl drop-shadow-md"
        >
          시훈아, 생일 축하해! 🎂
        </motion.h2>

        {/* 카드 */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="relative w-full max-w-2xl mx-auto mb-8"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
          >
            <motion.div
              className="p-8 border shadow-2xl bg-white/20 backdrop-blur-md rounded-3xl border-white/30"
              style={{ backfaceVisibility: "hidden" }}
              whileHover={{ scale: 1.02 }}
            >
              <Star className="mx-auto mb-4 text-yellow-300" size={40} />
              <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                생일 진심 * 100 만큼 축하해! 🎉
                <br />
                오늘 하루 세상에서 가장 행복한 사람이 되길 바랄게.
                <br />
                즐거운 하루 보내고 앞으로도 많이 친하게 지내자!
              </p>
              <div className="mt-8 text-lg font-bold text-white/80">
                - 너의 친구, 지후가 -
              </div>
              <motion.p
                className="mt-4 text-xs text-white/60"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                (카드를 클릭해서 뒤집어봐! 🔄)
              </motion.p>
            </motion.div>

            <div
              className="absolute inset-0 p-4 border shadow-2xl bg-white/20 backdrop-blur-md rounded-3xl border-white/30"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex items-center justify-center w-full h-full overflow-hidden bg-black/20 rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop"
                  alt="Birthday Surprise"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 소원 작성 모달 */}
        <AnimatePresence>
          {showWish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowWish(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-8 border shadow-2xl bg-white/20 backdrop-blur-xl rounded-3xl border-white/30"
              >
                <h3 className="mb-6 text-2xl font-bold text-center text-white">
                  🌟 생일 소원 🌟
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={currentWish}
                    onChange={(e) => setCurrentWish(e.target.value)}
                    placeholder="소원을 적어봐..."
                    className="w-full px-4 py-3 text-white transition-all border outline-none rounded-xl bg-white/10 border-white/20 focus:border-pink-400"
                    onKeyPress={(e) => e.key === "Enter" && addWish()}
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addWish}
                    className="w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    소원 빌기 ✨
                  </motion.button>
                </div>

                <div className="mt-6 space-y-2 overflow-y-auto max-h-40">
                  {wishes.map((wish, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="p-3 text-sm text-white border rounded-lg bg-white/10 border-white/20"
                    >
                      ⭐ {wish}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 생일 리마인더 모달 */}
        <AnimatePresence>
          {showReminder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowReminder(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-8 border shadow-2xl bg-white/20 backdrop-blur-xl rounded-3xl border-white/30"
              >
                <h3 className="mb-6 text-2xl font-bold text-center text-white">
                  📅 생일 리마인더 📅
                </h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={newReminder.name}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, name: e.target.value })
                    }
                    placeholder="이름"
                    className="w-full px-4 py-3 text-white transition-all border outline-none rounded-xl bg-white/10 border-white/20 focus:border-pink-400"
                  />

                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, date: e.target.value })
                    }
                    className="w-full px-4 py-3 text-white transition-all border outline-none rounded-xl bg-white/10 border-white/20 focus:border-pink-400"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addReminder}
                    className="w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500"
                  >
                    추가하기 🎂
                  </motion.button>
                </div>

                <div className="mt-6 space-y-2 overflow-y-auto max-h-60">
                  {reminders.map((reminder, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center justify-between p-3 text-white border rounded-lg bg-white/10 border-white/20"
                    >
                      <div>
                        <div className="font-bold">{reminder.name}</div>
                        <div className="text-xs text-white/60">
                          {reminder.date}
                        </div>
                      </div>
                      <span className="text-2xl">🎈</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 미스터리 박스 모달 */}
        <AnimatePresence>
          {showMysteryBoxes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowMysteryBoxes(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.8, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0.8, rotateY: 180 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl p-8 border shadow-2xl bg-white/20 backdrop-blur-xl rounded-3xl border-white/30"
              >
                <h3 className="mb-8 text-3xl font-bold text-center text-white">
                  🎁 미스터리 선물 박스 🎁
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {mysteryBoxes.map((box) => (
                    <motion.div
                      key={box.id}
                      className="relative"
                      whileHover={!box.opened ? { scale: 1.05 } : {}}
                      whileTap={!box.opened ? { scale: 0.95 } : {}}
                    >
                      {!box.opened ? (
                        <motion.div
                          onClick={(e) => {
                            e.stopPropagation();
                            openMysteryBox(box.id);
                          }}
                          className="flex flex-col items-center justify-center h-40 text-white transition-all border cursor-pointer bg-gradient-to-br from-purple-500/50 to-pink-500/50 rounded-2xl border-white/30 backdrop-blur-md hover:from-purple-500/70 hover:to-pink-500/70"
                          animate={{
                            rotateY: [0, 10, -10, 0],
                            y: [0, -5, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: box.id * 0.2,
                          }}
                        >
                          <motion.div
                            className="text-6xl"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            🎁
                          </motion.div>
                          <p className="mt-2 text-sm font-bold">
                            클릭해서 열어봐!
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ rotateY: 90, scale: 0 }}
                          animate={{ rotateY: 0, scale: 1 }}
                          className="flex flex-col items-center justify-center h-40 p-4 text-white border bg-white/20 rounded-2xl border-white/30 backdrop-blur-md"
                        >
                          <motion.div
                            className="mb-2 text-5xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ type: "spring" }}
                          >
                            {box.emoji}
                          </motion.div>
                          <p className="text-xs font-medium text-center">
                            {box.message}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMysteryBoxes((prev) =>
                      prev.map((box) => ({ ...box, opened: false })),
                    );
                  }}
                  className="w-full py-3 mt-6 font-bold text-white rounded-xl bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  🔄 다시 닫기
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Board */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-2xl mx-auto mt-12 mb-8"
        >
          <div
            className="p-6 border shadow-xl bg-white/10 backdrop-blur-md rounded-3xl border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
                <MessageCircle className="text-pink-400" />
                축하 메시지
              </h3>
              <div className="flex gap-1 p-1 rounded-full bg-white/5">
                <button
                  onClick={() => setSortOrder("newest")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                    sortOrder === "newest"
                      ? "bg-pink-500 text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  <ArrowDown size={14} /> 최신순
                </button>
                <button
                  onClick={() => setSortOrder("oldest")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                    sortOrder === "oldest"
                      ? "bg-pink-500 text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  <ArrowUp size={14} /> 오래된순
                </button>
              </div>
            </div>

            {/* Optimized Input Form */}
            <MessageForm onSend={handleSendMessage} isSending={isSending} />

            {/* Message List */}
            <div className="space-y-4 overflow-y-auto max-h-96">
              {messages.length === 0 ? (
                <p className="py-8 text-center text-white/40">
                  아직 메시지가 없습니다. 첫 번째 축하를 남겨보세요!
                </p>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ WebkitBackfaceVisibility: "hidden" }}
                    className="relative p-4 text-left transition-colors border rounded-2xl bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-bold text-pink-300">
                        {msg.author}
                      </span>
                      <span className="text-xs text-white/30">
                        {new Date(msg.created_at).toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                        })}
                      </span>
                    </div>
                    <p className="break-words whitespace-pre-wrap text-white/90">
                      {msg.content}
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteMsgId(msg.id)}
                        className="absolute p-2 text-red-400 transition-colors rounded-full top-2 right-2 hover:bg-white/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="mt-6 text-center">
                <motion.button
                  onClick={loadMoreMessages}
                  disabled={isLoadingMessages}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 font-bold text-white rounded-full disabled:cursor-not-allowed disabled:opacity-50 bg-white/20 backdrop-blur-md hover:bg-white/30"
                >
                  {isLoadingMessages ? "로딩 중..." : "더보기"}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-sm font-light text-white/60"
        >
          made by KwakJihu with gemini and claude
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BirthdayPage;
