import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  X,
  Shuffle,
  RotateCcw,
  Timer,
  Star,
  Search,
  BarChart3,
  Trophy,
  Target,
  Filter,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Lightbulb,
  Award,
  Calendar,
  FileText,
} from "lucide-react";
import { QUIZ_BANK, QUIZ_CATEGORIES, type QuizCategory, type QuizDifficulty, type QuizQuestion } from "@/data/quiz-bank";
import { load, save, dayKey } from "@/lib/storage";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

type Mode = "sequence" | "random" | "wrong" | "exam" | "favorites" | "list";

interface Stats {
  total: number;
  correct: number;
  byCategory: Record<string, { total: number; correct: number }>;
  streakDays: number;
  lastDays: string[];
  todayDone: number;
}

const STATS_KEY = "quiz_stats";
const WRONG_KEY = "quiz_wrong_ids";
const FAV_KEY = "quiz_favorites";
const TARGET_KEY = "quiz_daily_target";
const DAILY_KEY = "quiz_daily";

function loadStats(): Stats {
  return load<Stats>(STATS_KEY, {
    total: 0,
    correct: 0,
    byCategory: {},
    streakDays: 0,
    lastDays: [],
    todayDone: 0,
  });
}

function saveStats(s: Stats) {
  save(STATS_KEY, s);
}

function loadWrongIds(): string[] {
  return load<string[]>(WRONG_KEY, []);
}
function saveWrongIds(ids: string[]) {
  save(WRONG_KEY, ids);
}
function loadFavorites(): string[] {
  return load<string[]>(FAV_KEY, []);
}
function saveFavorites(ids: string[]) {
  save(FAV_KEY, ids);
}
function loadTarget(): number {
  return load<number>(TARGET_KEY, 20);
}

// 通用答案校验
function isAnswerCorrect(q: QuizQuestion, given: "A" | "B" | "C" | "D" | "E" | ("A" | "B" | "C" | "D" | "E")[]): boolean {
  const a = q.answer;
  if (Array.isArray(a)) {
    const givens = Array.isArray(given) ? given : [given];
    if (givens.length !== a.length) return false;
    return a.every((x) => givens.includes(x as any));
  }
  return a === given;
}

// 格式化答案为可显示字符串
function formatAnswer(a: string | string[]): string {
  if (Array.isArray(a)) return a.sort().join("、");
  return a;
}

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>("sequence");
  const [stats, setStats] = useState<Stats>(loadStats);
  const [wrongIds, setWrongIds] = useState<string[]>(loadWrongIds);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [dailyTarget, setDailyTarget] = useState<number>(loadTarget);
  const [filterCategory, setFilterCategory] = useState<QuizCategory | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<QuizDifficulty | "all">("all");
  const [search, setSearch] = useState("");
  const [currentList, setCurrentList] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);
  const [pickedList, setPickedList] = useState<("A" | "B" | "C" | "D" | "E")[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [examSeconds, setExamSeconds] = useState(20 * 60); // 20 分钟
  const [examActive, setExamActive] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, "A" | "B" | "C" | "D" | ("A" | "B" | "C" | "D" | "E")[]>>({});
  const [examFinished, setExamFinished] = useState(false);

  // 派生：题目库（带筛选/搜索）
  const filteredBank = useMemo(() => {
    return QUIZ_BANK.filter((q) => {
      if (filterCategory !== "all" && q.category !== filterCategory) return false;
      if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false;
      if (search && !q.question.includes(search) && !q.explanation.includes(search)) return false;
      return true;
    });
  }, [filterCategory, filterDifficulty, search]);

  // 启动某模式时加载题目
  useEffect(() => {
    if (mode === "sequence") {
      setCurrentList(filteredBank);
    } else if (mode === "random") {
      setCurrentList([...filteredBank].sort(() => Math.random() - 0.5));
    } else if (mode === "wrong") {
      const ids = new Set(wrongIds);
      setCurrentList(QUIZ_BANK.filter((q) => ids.has(q.id)));
    } else if (mode === "favorites") {
      const ids = new Set(favorites);
      setCurrentList(QUIZ_BANK.filter((q) => ids.has(q.id)));
    } else if (mode === "list") {
      setCurrentList(filteredBank);
    } else if (mode === "exam") {
      setCurrentList([...QUIZ_BANK].sort(() => Math.random() - 0.5).slice(0, 20));
    }
    setIdx(0);
    setPicked(null);
    setPickedList([]);
    setShowAnswer(false);
    setExamAnswers({});
    setExamFinished(false);
    setExamActive(false);
    setExamSeconds(20 * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 考试计时
  useEffect(() => {
    if (!examActive) return;
    if (examSeconds <= 0) {
      setExamFinished(true);
      return;
    }
    const t = setInterval(() => setExamSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [examActive, examSeconds]);

  // 每日目标
  useEffect(() => {
    save(TARGET_KEY, dailyTarget);
  }, [dailyTarget]);

  const q = currentList[idx];
  const total = currentList.length;
  const progress = total ? ((idx + 1) / total) * 100 : 0;

  // 单题模式：选完答案后自动展示反馈；用户点"下一题"
  const handlePick = (k: "A" | "B" | "C" | "D" | "E") => {
    if (!q || showAnswer) return;
    const type = q.type || "single";
    if (type === "multi") {
      // 多选：累加/移除选项，必须所有答案都对才算正确
      const nextPicked = pickedList.includes(k)
        ? pickedList.filter((x) => x !== k)
        : [...pickedList, k];
      setPickedList(nextPicked);
    } else {
      // 单选 / 案例
      setPicked(k);
      const correct = isAnswerCorrect(q, k);
      setShowAnswer(true);
      recordAnswer(q, correct);
    }
  };

  const handleMultiSubmit = () => {
    if (!q || pickedList.length === 0) return;
    setShowAnswer(true);
    const correct = isAnswerCorrect(q, pickedList);
    recordAnswer(q, correct);
  };

  const handleNext = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
      setPicked(null);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setPicked(null);
      setShowAnswer(false);
    }
  };

  const recordAnswer = (question: QuizQuestion, isCorrect: boolean) => {
    setStats((prev) => {
      const today = dayKey();
      const lastDays = prev.lastDays ?? [];
      const isToday = lastDays[lastDays.length - 1] === today;
      const newByCat = { ...(prev.byCategory || {}) };
      const cat = question.category;
      const prevCat = newByCat[cat] || { total: 0, correct: 0 };
      newByCat[cat] = {
        total: prevCat.total + 1,
        correct: prevCat.correct + (isCorrect ? 1 : 0),
      };
      let streakDays = prev.streakDays;
      let newLastDays = lastDays.slice();
      if (!isToday) {
        newLastDays.push(today);
        const uniq = Array.from(new Set(newLastDays)).sort();
        // 计算连续天数
        let streak = 0;
        let cur = new Date();
        for (let i = uniq.length - 1; i >= 0; i--) {
          const k = dayKey(cur);
          if (uniq[i] === k) {
            streak++;
            cur.setDate(cur.getDate() - 1);
          } else break;
        }
        streakDays = streak;
      }
      const next: Stats = {
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        byCategory: newByCat,
        streakDays,
        lastDays: newLastDays,
        todayDone: isToday ? prev.todayDone + 1 : 1,
      };
      saveStats(next);
      return next;
    });
    if (!isCorrect) {
      const next = Array.from(new Set([...wrongIds, question.id]));
      setWrongIds(next);
      saveWrongIds(next);
    }
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(next);
    saveFavorites(next);
  };

  const removeFromWrong = (id: string) => {
    const next = wrongIds.filter((x) => x !== id);
    setWrongIds(next);
    saveWrongIds(next);
    setCurrentList((cur) => cur.filter((q) => q.id !== id));
  };

  // 考试：完成
  const finishExam = () => {
    setExamFinished(true);
    setExamActive(false);
  };

  // 考试：计分
  const examResult = useMemo(() => {
    if (!examFinished) return null;
    let correct = 0;
    for (const qq of currentList) {
      const ans = examAnswers[qq.id];
      if (ans === qq.answer) correct++;
    }
    return {
      correct,
      total: currentList.length,
      ratio: currentList.length ? Math.round((correct / currentList.length) * 100) : 0,
    };
  }, [examFinished, examAnswers, currentList]);

  // 模拟考试题目作答
  const handleExamPick = (qid: string, k: "A" | "B" | "C" | "D") => {
    if (examFinished) return;
    if (!examActive) setExamActive(true);
    setExamAnswers((a) => ({ ...a, [qid]: k }));
  };

  // 统计
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const todayProgress = dailyTarget > 0 ? Math.min(100, Math.round((stats.todayDone / dailyTarget) * 100)) : 0;

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Knowledge Bank</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">刷题中心</h1>
          <p className="text-sm text-ink-mute mt-1">
            覆盖解剖、评定、肌骨、神经、心肺、儿童、物理治疗、运动医学八大专题。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "sequence" as Mode, label: "顺序模式", Icon: BookOpen },
            { id: "random" as Mode, label: "随机模式", Icon: Shuffle },
            { id: "wrong" as Mode, label: `错题本${wrongIds.length > 0 ? ` (${wrongIds.length})` : ""}`, Icon: RotateCcw },
            { id: "exam" as Mode, label: "模拟考试", Icon: Timer },
            { id: "favorites" as Mode, label: `收藏${favorites.length > 0 ? ` (${favorites.length})` : ""}`, Icon: Star },
            { id: "list" as Mode, label: "题库浏览", Icon: FileText },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn("btn-sm rounded px-3 py-1.5 text-2xs border transition-colors inline-flex items-center gap-1.5", mode === m.id ? "bg-teal-500 text-cream-50 border-teal-500" : "border-line bg-surface text-ink-soft hover:border-teal-400")}
            >
              <m.Icon className="h-3.5 w-3.5" />
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* 统计卡 */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatTile icon={Trophy} label="累计答题" value={`${stats.total}`} suffix="题" color="text-teal-500" />
        <StatTile icon={Target} label="正确率" value={`${accuracy}`} suffix="%" color="text-coral" />
        <StatTile icon={Award} label="连续学习" value={`${stats.streakDays}`} suffix="天" color="text-amber-dark" />
        <StatTile icon={Calendar} label="今日已答" value={`${stats.todayDone}`} suffix={`/${dailyTarget}`} color="text-teal-400" />
        <StatTile icon={BarChart3} label="错题本" value={`${wrongIds.length}`} suffix="题" color="text-coral" />
      </section>

      {/* 今日目标进度 */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-sm text-ink font-medium">今日学习目标</span>
            <span className="text-2xs text-ink-mute">
              {stats.todayDone} / {dailyTarget} 题
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xs text-ink-mute">调整</span>
            {[10, 20, 30, 50].map((n) => (
              <button
                key={n}
                onClick={() => setDailyTarget(n)}
                className={cn("chip text-2xs", dailyTarget === n && "chip-active")}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-coral transition-all" style={{ width: `${todayProgress}%` }} />
        </div>
      </section>

      {/* 主体 */}
      {mode === "list" ? (
        <QuestionBankList
          list={filteredBank}
          favorites={favorites}
          onToggleFav={toggleFavorite}
          onStart={(qid) => {
            setMode("sequence");
            const idxOf = filteredBank.findIndex((q) => q.id === qid);
            if (idxOf >= 0) setIdx(idxOf);
          }}
        />
      ) : mode === "exam" ? (
        <ExamRunner
          list={currentList}
          answers={examAnswers}
          seconds={examSeconds}
          active={examActive}
          finished={examFinished}
          onPick={handleExamPick}
          onFinish={finishExam}
          onRestart={() => {
            setMode("exam");
            setExamActive(false);
            setExamSeconds(20 * 60);
            setExamAnswers({});
            setExamFinished(false);
          }}
          result={examResult}
        />
      ) : currentList.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title={mode === "wrong" ? "暂无错题" : mode === "favorites" ? "暂无收藏" : "暂无题目"}
            desc={mode === "wrong" ? "继续保持，遇到错题会自动收录" : mode === "favorites" ? "点击题目右上角的星标即可收藏" : "尝试调整筛选或更换模式"}
            action={
              <div className="flex gap-2">
                <button onClick={() => setMode("sequence")} className="btn-primary btn-sm">开始顺序刷题</button>
                {wrongIds.length > 0 && <button onClick={() => setMode("list")} className="btn-ghost btn-sm">浏览题库</button>}
              </div>
            }
          />
        </div>
      ) : q ? (
        <div className="space-y-3">
          {/* 分类/难度筛选 + 搜索 */}
          <div className="card p-4 flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
              <input className="input pl-8" placeholder="搜索题目关键词" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-2xs text-ink-mute inline-flex items-center gap-1"><Filter className="h-3 w-3" /> 分类</span>
              <button onClick={() => setFilterCategory("all")} className={cn("chip text-2xs", filterCategory === "all" && "chip-active")}>全部</button>
              {QUIZ_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setFilterCategory(c.id)} className={cn("chip text-2xs", filterCategory === c.id && "chip-active")}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-2xs text-ink-mute">难度</span>
              {(["all", "easy", "medium", "hard"] as const).map((d) => (
                <button key={d} onClick={() => setFilterDifficulty(d as any)} className={cn("chip text-2xs", filterDifficulty === d && "chip-active")}>
                  {d === "all" ? "全部" : d === "easy" ? "简单" : d === "medium" ? "中等" : "困难"}
                </button>
              ))}
            </div>
          </div>

          {/* 进度条 */}
          <div className="card p-3">
            <div className="flex items-center justify-between text-2xs text-ink-mute mb-1.5">
              <span>第 {idx + 1} / {total} 题</span>
              <span className="stat-num">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* 题目卡 */}
          <div key={q.id} className="card p-7 animate-fade-up">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={cn("chip text-2xs", categoryColor(q.category))}>{categoryName(q.category)}</span>
              <span className={cn("chip text-2xs", difficultyColor(q.difficulty))}>{difficultyName(q.difficulty)}</span>
              <span className="text-2xs text-ink-faint ml-auto">{q.source}</span>
              <button
                onClick={() => toggleFavorite(q.id)}
                className={cn("h-7 w-7 grid place-items-center rounded border", favorites.includes(q.id) ? "border-amber bg-amber-soft/40 text-amber-dark" : "border-line text-ink-faint hover:text-amber-dark")}
                title="收藏"
              >
                <Star className={cn("h-3.5 w-3.5", favorites.includes(q.id) && "fill-current")} />
              </button>
              {wrongIds.includes(q.id) && (
                <button onClick={() => removeFromWrong(q.id)} className="h-7 px-2 grid place-items-center rounded border border-coral-soft/40 text-coral-dark text-2xs" title="从错题本移除">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="font-display text-xl text-ink leading-snug mb-3 text-balance">{q.question}</p>
            {q.case && (
              <div className="rounded border border-teal-300 bg-teal-50/40 p-3 mb-5 text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                <div className="text-2xs font-medium text-teal-600 mb-1 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> 病例摘要
                </div>
                {q.case}
              </div>
            )}
            <div className="flex items-center gap-2 mb-3 text-2xs text-ink-mute">
              <span className="chip text-2xs bg-cream-200 text-ink-soft border-line">
                {q.type === "multi" ? "多选题" : q.type === "case" ? "案例分析" : "单选题"}
              </span>
              {q.subCategory && <span className="text-ink-faint">· {q.subCategory}</span>}
              {q.evidenceLevel && <span className="chip text-2xs bg-teal-50 border-teal-300 text-teal-700">证据 {q.evidenceLevel}</span>}
            </div>
            <div className="space-y-2.5">
              {(["A", "B", "C", "D", "E"] as const).filter((k) => q.options[k]).map((k) => {
                const selectedMulti = pickedList.includes(k);
                const selectedSingle = picked === k;
                const selected = (q.type === "multi" ? selectedMulti : selectedSingle);
                const correctSet = Array.isArray(q.answer) ? q.answer : [q.answer];
                const isAnswer = correctSet.includes(k);
                const show = showAnswer;
                return (
                  <button
                    key={k}
                    onClick={() => handlePick(k)}
                    disabled={show && q.type !== "multi"}
                    className={cn(
                      "w-full flex items-center gap-3 rounded border px-4 py-3 text-left transition-all",
                      show && isAnswer ? "border-teal-500 bg-teal-50" : "",
                      show && selected && !isAnswer ? "border-coral-soft bg-coral-soft/10" : "",
                      !show && selected ? "border-teal-500 bg-teal-50" : "",
                      !show && !selected ? "border-line bg-surface hover:border-teal-300 hover:bg-cream-50" : "",
                      show && !isAnswer && !selected ? "border-line bg-surface opacity-60" : "",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full border text-2xs font-medium shrink-0",
                        show && isAnswer ? "border-teal-500 bg-teal-500 text-cream-50" :
                        show && selected ? "border-coral bg-coral text-white" :
                        selected ? "border-teal-500 bg-teal-500 text-cream-50" :
                        "border-line text-ink-mute",
                      )}
                    >
                      {show && isAnswer ? <Check className="h-3.5 w-3.5" /> : show && selected ? <X className="h-3.5 w-3.5" /> : k}
                    </span>
                    <span className={cn("text-sm flex-1", (show && isAnswer) || selected ? "text-ink font-medium" : "text-ink-soft")}>{q.options[k]}</span>
                  </button>
                );
              })}
            </div>

            {/* 多选题：提交按钮 */}
            {q && q.type === "multi" && !showAnswer && (
              <button
                onClick={handleMultiSubmit}
                disabled={pickedList.length === 0}
                className="btn-primary mt-3 w-full disabled:opacity-40"
              >
                提交答案（已选 {pickedList.length} 项）
              </button>
            )}

            {/* 反馈区 */}
            {showAnswer && (
              <div className="mt-5 rounded border border-line bg-cream-50/60 p-4 animate-fade-up">
                <div className="flex items-center gap-2 mb-2">
                  {isAnswerCorrect(q, q.type === "multi" ? pickedList : picked) ? (
                    <span className="chip chip-active text-2xs"><Check className="h-3 w-3" /> 回答正确</span>
                  ) : (
                    <span className="chip text-2xs bg-coral-soft/40 border-coral-soft text-coral-dark">
                      <X className="h-3 w-3" /> 正确答案为 {formatAnswer(q.answer)}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-ink-soft leading-relaxed">
                  <Lightbulb className="h-4 w-4 text-amber-dark mt-0.5 shrink-0" />
                  <p>{q.explanation}</p>
                </div>
                {wrongIds.includes(q.id) && (
                  <button onClick={() => removeFromWrong(q.id)} className="btn-ghost btn-sm mt-3 text-2xs">已掌握，从错题本移除</button>
                )}
              </div>
            )}
          </div>

          {/* 导航 */}
          <div className="flex items-center justify-between">
            <button onClick={handlePrev} disabled={idx === 0} className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed">
              <ArrowLeft className="h-4 w-4" /> 上一题
            </button>
            <div className="flex items-center gap-1">
              {currentList.map((qq, i) => (
                <button
                  key={qq.id}
                  onClick={() => { setIdx(i); setPicked(null); setShowAnswer(false); }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === idx ? "w-5 bg-coral" : "w-1.5 bg-cream-300",
                  )}
                  title={`第 ${i + 1} 题`}
                />
              ))}
            </div>
            <button onClick={handleNext} disabled={idx >= total - 1} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              下一题 <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 分类正确率 */}
          <section className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-teal-500" />
              <h2 className="section-title">各分类正确率</h2>
              <span className="text-2xs text-ink-mute">基于历史作答</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUIZ_CATEGORIES.map((c) => {
                const item = stats.byCategory?.[c.id] || { total: 0, correct: 0 };
                const acc = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                return (
                  <div key={c.id} className="rounded border border-line p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn("text-sm font-medium", c.color)}>{c.name}</span>
                      <span className="stat-num text-2xs text-ink-mute">{item.correct}/{item.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${acc}%` }} />
                    </div>
                    <p className="text-2xs text-ink-mute mt-1">{acc}%</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, suffix, color }: { icon: typeof Trophy; label: string; value: string; suffix: string; color: string }) {
  return (
    <div className="card p-4">
      <Icon className={cn("h-4 w-4", color)} strokeWidth={1.7} />
      <p className="mt-2 stat-num text-xl text-ink">{value}<span className="text-xs text-ink-mute ml-0.5">{suffix}</span></p>
      <p className="text-2xs text-ink-mute mt-0.5">{label}</p>
    </div>
  );
}

function QuestionBankList({ list, favorites, onToggleFav, onStart }: { list: QuizQuestion[]; favorites: string[]; onToggleFav: (id: string) => void; onStart: (id: string) => void }) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">题库浏览（共 {list.length} 题）</h2>
      </div>
      <div className="divide-y divide-line max-h-[60vh] overflow-y-auto">
        {list.map((q, i) => (
          <div key={q.id} className="flex items-start gap-3 py-3 -mx-2 px-2 rounded hover:bg-cream-50/60">
            <span className="stat-num text-2xs text-ink-faint w-6 text-right shrink-0 mt-0.5">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink line-clamp-2">{q.question}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className={cn("chip text-2xs", categoryColor(q.category))}>{categoryName(q.category)}</span>
                <span className={cn("chip text-2xs", difficultyColor(q.difficulty))}>{difficultyName(q.difficulty)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => onToggleFav(q.id)} className={cn("h-7 w-7 grid place-items-center rounded border", favorites.includes(q.id) ? "border-amber bg-amber-soft/40 text-amber-dark" : "border-line text-ink-faint hover:text-amber-dark")}>
                <Star className={cn("h-3.5 w-3.5", favorites.includes(q.id) && "fill-current")} />
              </button>
              <button onClick={() => onStart(q.id)} className="btn-ghost btn-sm text-2xs">
                前往 <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExamRunner({
  list,
  answers,
  seconds,
  active,
  finished,
  onPick,
  onFinish,
  onRestart,
  result,
}: {
  list: QuizQuestion[];
  answers: Record<string, "A" | "B" | "C" | "D">;
  seconds: number;
  active: boolean;
  finished: boolean;
  onPick: (qid: string, k: "A" | "B" | "C" | "D") => void;
  onFinish: () => void;
  onRestart: () => void;
  result: { correct: number; total: number; ratio: number } | null;
}) {
  const answeredCount = Object.keys(answers).length;
  if (finished && result) {
    return (
      <section className="card p-7 text-center space-y-3">
        <Trophy className="h-10 w-10 mx-auto text-amber-dark" />
        <h2 className="font-display text-2xl text-ink">考试结束</h2>
        <p className="text-sm text-ink-mute">本次共 {result.total} 题，答对 {result.correct} 题，正确率 <span className="stat-num text-coral">{result.ratio}%</span></p>
        <div className="grid sm:grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="rounded border border-line p-3">
            <p className="stat-num text-2xl text-teal-500">{result.correct}</p>
            <p className="text-2xs text-ink-mute">答对</p>
          </div>
          <div className="rounded border border-line p-3">
            <p className="stat-num text-2xl text-coral">{result.total - result.correct}</p>
            <p className="text-2xs text-ink-mute">答错</p>
          </div>
          <div className="rounded border border-line p-3">
            <p className="stat-num text-2xl text-amber-dark">{result.ratio}%</p>
            <p className="text-2xs text-ink-mute">正确率</p>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button onClick={onRestart} className="btn-primary btn-sm"><RotateCcw className="h-3.5 w-3.5" /> 再考一次</button>
        </div>
        <div className="mt-4 max-h-[40vh] overflow-y-auto text-left">
          {list.map((q, i) => {
            const a = answers[q.id];
            const right = a === q.answer;
            return (
              <div key={q.id} className={cn("rounded border p-3 mb-2", right ? "border-teal-200 bg-teal-50/40" : "border-coral-soft/40 bg-coral-soft/10")}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xs text-ink-mute">第 {i + 1} 题</span>
                  {right ? <Check className="h-3.5 w-3.5 text-teal-500" /> : <X className="h-3.5 w-3.5 text-coral" />}
                  <span className="text-2xs text-ink-mute">你的答案：{a || "未作答"} / 正确答案：{q.answer}</span>
                </div>
                <p className="text-sm text-ink line-clamp-2">{q.question}</p>
                <p className="text-2xs text-ink-mute mt-1 line-clamp-2">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      <div className="card p-4 sticky top-[68px] z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 text-coral" />
            <span className="stat-num text-lg text-ink">{formatTime(seconds)}</span>
            <span className="text-2xs text-ink-mute">已答 {answeredCount} / {list.length}</span>
          </div>
          <button onClick={onFinish} disabled={!active} className="btn-coral btn-sm disabled:opacity-50">
            <Check className="h-3.5 w-3.5" /> 交卷
          </button>
        </div>
        <div className="h-1 rounded-full bg-cream-200 overflow-hidden mt-2">
          <div className="h-full bg-coral transition-all" style={{ width: `${(answeredCount / list.length) * 100}%` }} />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-3">
        {list.map((q, i) => {
          const picked = answers[q.id];
          return (
            <div key={q.id} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="stat-num text-2xs text-ink-mute">第 {i + 1} 题</span>
                <span className={cn("chip text-2xs", categoryColor(q.category))}>{categoryName(q.category)}</span>
              </div>
              <p className="text-sm text-ink mb-3 leading-relaxed line-clamp-3">{q.question}</p>
              <div className="space-y-1.5">
                {(["A", "B", "C", "D"] as const).map((k) => {
                  const sel = picked === k;
                  return (
                    <button
                      key={k}
                      onClick={() => onPick(q.id, k)}
                      className={cn(
                        "w-full flex items-center gap-2 rounded border px-2.5 py-1.5 text-left text-2xs transition-all",
                        sel ? "border-teal-500 bg-teal-50" : "border-line bg-surface hover:border-teal-300",
                      )}
                    >
                      <span className={cn("h-4 w-4 grid place-items-center rounded-full border text-2xs shrink-0", sel ? "border-teal-500 bg-teal-500 text-cream-50" : "border-line text-ink-mute")}>
                        {sel ? <Check className="h-2.5 w-2.5" /> : k}
                      </span>
                      <span className="flex-1">{q.options[k]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function categoryName(c: QuizCategory): string {
  return QUIZ_CATEGORIES.find((x) => x.id === c)?.name ?? c;
}
function categoryColor(c: QuizCategory): string {
  const meta = QUIZ_CATEGORIES.find((x) => x.id === c);
  return meta ? `bg-cream-200/60 ${meta.color}` : "bg-cream-200/60 text-ink-soft";
}
function difficultyName(d: QuizDifficulty): string {
  return d === "easy" ? "简单" : d === "medium" ? "中等" : "困难";
}
function difficultyColor(d: QuizDifficulty): string {
  return d === "easy" ? "bg-teal-50 text-teal-600" : d === "medium" ? "bg-amber-soft/40 text-amber-dark" : "bg-coral-soft/40 text-coral-dark";
}
