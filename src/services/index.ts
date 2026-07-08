import type {
  AssessmentRecord,
  Checkin,
  Exercise,
  Pathway,
  PathwayState,
  PathwaySuggestion,
  Patient,
  Plan,
  PlanEntry,
  Scale,
  User,
} from "@/lib/types";
import { dayKey, load, save, uid } from "@/lib/storage";
import {
  DEMO_PATIENTS,
  DEMO_THERAPIST,
  EXERCISES,
  PATHWAYS,
  SCALES,
} from "@/data/seed";

const KEYS = {
  users: "users",
  session: "session",
  patients: "patients",
  records: "records",
  plans: "plans",
  checkins: "checkins",
  pwstates: "pathway_states",
  seeded: "seed_loaded",
} as const;

// ============ 种子初始化 ============
export function ensureSeed(): void {
  if (load(KEYS.seeded, false)) return;
  save(KEYS.users, [DEMO_THERAPIST]);
  save(KEYS.patients, DEMO_PATIENTS);
  save(KEYS.records, []);
  save(KEYS.plans, []);
  save(KEYS.checkins, []);
  save(KEYS.pwstates, []);
  save(KEYS.seeded, true);
}

// ============ 认证 ============
export const auth = {
  current(): User | null {
    const id = load<string | null>(KEYS.session, null);
    if (!id) return null;
    const users = load<User[]>(KEYS.users, []);
    return users.find((u) => u.id === id) ?? null;
  },
  register(input: { email: string; password: string; name: string; role: "therapist" | "patient"; license?: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = load<User[]>(KEYS.users, []);
        if (users.some((u) => u.email === input.email)) {
          reject(new Error("该邮箱已注册"));
          return;
        }
        const user: User = {
          id: uid("u"),
          email: input.email,
          password: input.password,
          role: input.role,
          name: input.name,
          license: input.license,
          createdAt: Date.now(),
        };
        users.push(user);
        save(KEYS.users, users);
        save(KEYS.session, user.id);
        resolve(user);
      }, 350);
    });
  },
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = load<User[]>(KEYS.users, []);
        const user = users.find((u) => u.email === email);
        if (!user || user.password !== password) {
          reject(new Error("邮箱或密码不正确"));
          return;
        }
        save(KEYS.session, user.id);
        resolve(user);
      }, 350);
    });
  },
  logout(): void {
    save(KEYS.session, null);
  },
};

// ============ 评估 ============
export const assess = {
  listScales(category?: string): Scale[] {
    return SCALES.filter((s) => !category || s.category === category);
  },
  getScale(id: string): Scale | undefined {
    return SCALES.find((s) => s.id === id);
  },
  submit(scaleId: string, patientId: string, therapistId: string, answers: Record<string, number>): AssessmentRecord {
    const scale = this.getScale(scaleId);
    if (!scale) throw new Error("量表不存在");
    const users = load<User[]>(KEYS.users, []);
    const patients = load<Patient[]>(KEYS.patients, []);
    const patient = patients.find((p) => p.id === patientId);
    const therapist = users.find((u) => u.id === therapistId);

    // 计分
    let totalScore = 0;
    let maxScore = 0;
    const dimMap: Record<string, { score: number; max: number }> = {};
    for (const q of scale.questions) {
      const score = answers[q.id] ?? 0;
      const qMax = Math.max(...q.options.map((o) => o.score));
      totalScore += score;
      maxScore += qMax;
      if (!dimMap[q.dimension]) dimMap[q.dimension] = { score: 0, max: 0 };
      dimMap[q.dimension].score += score;
      dimMap[q.dimension].max += qMax;
    }
    // 用 scale.grading.max 作为分级基准（部分量表含固定权重）
    const gradeBase = scale.grading.max;
    const ratio = gradeBase > 0 ? totalScore / gradeBase : 0;
    // 找到满足 min <= (映射到 gradeBase 的得分) 的等级
    const mappedScore = Math.round(ratio * gradeBase);
    const gradeEntry = [...scale.grading.grades]
      .sort((a, b) => b.min - a.min)
      .find((g) => mappedScore >= g.min) ?? scale.grading.grades[0];

    const record: AssessmentRecord = {
      id: uid("rec"),
      scaleId,
      scaleTitle: scale.title,
      category: scale.category,
      patientId,
      patientName: patient?.name ?? "未知患者",
      therapistId,
      answers,
      totalScore,
      maxScore,
      grade: gradeEntry.label,
      tone: gradeEntry.tone,
      dimensionScores: Object.entries(dimMap).map(([dimension, v]) => ({ dimension, score: v.score, max: v.max })),
      takenAt: Date.now(),
    };
    const records = load<AssessmentRecord[]>(KEYS.records, []);
    records.push(record);
    save(KEYS.records, records);
    // 记录患者所属治疗师便于查询
    void therapist;
    return record;
  },
  listRecords(patientId?: string): AssessmentRecord[] {
    const records = load<AssessmentRecord[]>(KEYS.records, []);
    return records
      .filter((r) => !patientId || r.patientId === patientId)
      .sort((a, b) => b.takenAt - a.takenAt);
  },
  getRecord(id: string): AssessmentRecord | undefined {
    return load<AssessmentRecord[]>(KEYS.records, []).find((r) => r.id === id);
  },
};

// ============ 患者 ============
export const patient = {
  list(therapistId?: string): Patient[] {
    const all = load<Patient[]>(KEYS.patients, []);
    return all
      .filter((p) => !therapistId || p.therapistId === therapistId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  get(id: string): Patient | undefined {
    return load<Patient[]>(KEYS.patients, []).find((p) => p.id === id);
  },
  create(input: Omit<Patient, "id" | "createdAt">): Patient {
    const all = load<Patient[]>(KEYS.patients, []);
    const p: Patient = { ...input, id: uid("p"), createdAt: Date.now() };
    all.push(p);
    save(KEYS.patients, all);
    return p;
  },
  update(id: string, patch: Partial<Patient>): Patient | undefined {
    const all = load<Patient[]>(KEYS.patients, []);
    const idx = all.findIndex((p) => p.id === id);
    if (idx < 0) return undefined;
    all[idx] = { ...all[idx], ...patch };
    save(KEYS.patients, all);
    return all[idx];
  },
};

// ============ 计划 ============
export const plan = {
  list(patientId?: string): Plan[] {
    const all = load<Plan[]>(KEYS.plans, []);
    return all
      .filter((p) => !patientId || p.patientId === patientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  get(id: string): Plan | undefined {
    return load<Plan[]>(KEYS.plans, []).find((p) => p.id === id);
  },
  listExercises(filter?: { bodyPart?: string; goal?: string }): Exercise[] {
    return EXERCISES.filter(
      (e) => (!filter?.bodyPart || e.bodyPart === filter.bodyPart) && (!filter?.goal || e.goal === filter.goal),
    );
  },
  getExercise(id: string): Exercise | undefined {
    return EXERCISES.find((e) => e.id === id);
  },
  // 基于评估记录生成计划草稿
  generateFrom(recordId: string, therapistId: string): Plan | undefined {
    const record = assess.getRecord(recordId);
    if (!record) return undefined;
    const scale = assess.getScale(record.scaleId);
    const p = patient.get(record.patientId);
    if (!p || !scale) return undefined;

    // 根据类别与分级选取动作
    const toEntry = (e: Exercise) => ({ exerciseId: e.id, sets: e.defaultSets, reps: e.defaultReps });
    const pickByGoal = (goal: string, n: number) =>
      EXERCISES.filter((e) => e.goal === goal).slice(0, n).map(toEntry);
    const pickByPart = (part: string, n: number) =>
      EXERCISES.filter((e) => e.bodyPart === part).slice(0, n).map(toEntry);

    let entries: { exerciseId: string; sets: number; reps: number }[] = [];
    if (record.category === "neuro") {
      entries = [
        ...pickByPart("平衡", 2),
        ...pickByPart("手", 1),
        ...pickByGoal("核心稳定", 1),
        ...pickByPart("步态", 1),
      ];
    } else if (record.category === "musculo") {
      const part = scale.id.startsWith("constant") ? "肩" : scale.id.startsWith("joa") ? "腰" : "膝";
      entries = [...pickByPart(part, 3), ...pickByGoal("核心稳定", 1), ...pickByGoal("活动度", 1)];
    } else if (record.category === "cardio") {
      entries = [...pickByPart("心肺", 3)];
    } else {
      entries = [...pickByGoal("核心稳定", 2), ...pickByPart("平衡", 2)];
    }

    const schedule = [1, 2, 3, 4, 5, 6, 7].map((day) => ({
      day,
      entries: day % 2 === 1 ? entries.map((e) => ({ ...e })) : [],
    }));

    const newPlan: Plan = {
      id: uid("plan"),
      patientId: p.id,
      patientName: p.name,
      recordId,
      title: `${scale.abbr} 术后/康复计划`,
      goal: `基于 ${record.grade} 分级，恢复功能并推进路径`,
      schedule,
      durationWeeks: 4,
      createdAt: Date.now(),
      active: true,
    };
    const all = load<Plan[]>(KEYS.plans, []);
    all.push(newPlan);
    save(KEYS.plans, all);
    void therapistId;
    return newPlan;
  },
  update(id: string, patch: Partial<Plan>): Plan | undefined {
    const all = load<Plan[]>(KEYS.plans, []);
    const idx = all.findIndex((p) => p.id === id);
    if (idx < 0) return undefined;
    all[idx] = { ...all[idx], ...patch };
    save(KEYS.plans, all);
    return all[idx];
  },
  setEntry(planId: string, day: number, entries: PlanEntry[]): Plan | undefined {
    const all = load<Plan[]>(KEYS.plans, []);
    const idx = all.findIndex((p) => p.id === planId);
    if (idx < 0) return undefined;
    all[idx].schedule = all[idx].schedule.map((d) => (d.day === day ? { ...d, entries } : d));
    save(KEYS.plans, all);
    return all[idx];
  },
};

// ============ 进度 ============
export const progress = {
  listCheckins(planId?: string, range?: { from: string; to: string }): Checkin[] {
    const all = load<Checkin[]>(KEYS.checkins, []);
    return all
      .filter((c) => !planId || c.planId === planId)
      .filter((c) => (!range || (c.dayKey >= range.from && c.dayKey <= range.to)))
      .sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  },
  checkin(input: { planId: string; patientId: string; dayKey: string; entries: Checkin["entries"]; rpe: number; note?: string }): Checkin {
    const all = load<Checkin[]>(KEYS.checkins, []);
    const existingIdx = all.findIndex((c) => c.planId === input.planId && c.dayKey === input.dayKey);
    const rec: Checkin = {
      id: existingIdx >= 0 ? all[existingIdx].id : uid("ck"),
      planId: input.planId,
      patientId: input.patientId,
      dayKey: input.dayKey,
      entries: input.entries,
      rpe: input.rpe,
      note: input.note,
      createdAt: Date.now(),
    };
    if (existingIdx >= 0) all[existingIdx] = rec;
    else all.push(rec);
    save(KEYS.checkins, all);
    return rec;
  },
  // 计算某计划在日期范围内的打卡完成率
  completionRate(planId: string, days = 28): { rate: number; doneDays: number; plannedDays: number } {
    const pl = plan.get(planId);
    if (!pl) return { rate: 0, doneDays: 0, plannedDays: 0 };
    const checkins = this.listCheckins(planId);
    const today = new Date();
    let plannedDays = 0;
    let doneDays = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dow = ((d.getDay() + 6) % 7) + 1; // 周一=1
      const sched = pl.schedule.find((s) => s.day === dow);
      if (sched && sched.entries.length > 0) {
        plannedDays++;
        const dk = dayKey(d);
        const ck = checkins.find((c) => c.dayKey === dk);
        if (ck && ck.entries.length > 0) {
          const done = ck.entries.filter((e) => e.done).length;
          if (done / ck.entries.length >= 0.5) doneDays++;
        }
      }
    }
    return { rate: plannedDays ? Math.round((doneDays / plannedDays) * 100) : 0, doneDays, plannedDays };
  },
  // 趋势：从打卡中提取 RPE，从评估中提取分数
  metrics(patientId: string, metric: "rpe" | "pain" | "rom" | "strength", windowDays = 30): { date: string; value: number }[] {
    if (metric === "rpe") {
      const plans = plan.list(patientId);
      const points: { date: string; value: number }[] = [];
      for (const pl of plans) {
        const cks = this.listCheckins(pl.id);
        for (const c of cks) {
          points.push({ date: c.dayKey, value: c.rpe });
        }
      }
      return points.sort((a, b) => a.date.localeCompare(b.date)).slice(-windowDays);
    }
    // 其余指标从评估记录的趋势模拟
    const records = assess.listRecords(patientId);
    const points = records.map((r) => {
      const v = metric === "pain" ? Math.max(0, 10 - (r.totalScore / Math.max(r.maxScore, 1)) * 10) : (r.totalScore / Math.max(r.maxScore, 1)) * 100;
      return { date: dayKey(new Date(r.takenAt)), value: Math.round(v * 10) / 10 };
    });
    return points.sort((a, b) => a.date.localeCompare(b.date)).slice(-windowDays);
  },
};

// ============ 临床路径 ============
export const pathway = {
  list(): Pathway[] {
    return PATHWAYS;
  },
  get(id: string): Pathway | undefined {
    return PATHWAYS.find((p) => p.id === id);
  },
  statesByPatient(patientId: string): PathwayState[] {
    return load<PathwayState[]>(KEYS.pwstates, []).filter((s) => s.patientId === patientId);
  },
  state(patientId: string, pathwayId: string): PathwayState | undefined {
    return this.statesByPatient(patientId).find((s) => s.pathwayId === pathwayId);
  },
  start(patientId: string, pathwayId: string): PathwayState {
    const all = load<PathwayState[]>(KEYS.pwstates, []);
    let st = all.find((s) => s.patientId === patientId && s.pathwayId === pathwayId);
    if (st) return st;
    st = { id: uid("pwst"), patientId, pathwayId, currentStage: 0, startedAt: Date.now(), history: [] };
    all.push(st);
    save(KEYS.pwstates, all);
    return st;
  },
  advance(patientId: string, pathwayId: string): PathwayState | undefined {
    const all = load<PathwayState[]>(KEYS.pwstates, []);
    const idx = all.findIndex((s) => s.patientId === patientId && s.pathwayId === pathwayId);
    if (idx < 0) return undefined;
    const pw = this.get(pathwayId);
    if (!pw) return undefined;
    if (all[idx].currentStage >= pw.stages.length - 1) return all[idx];
    const from = all[idx].currentStage;
    all[idx].currentStage += 1;
    all[idx].history.push({ at: Date.now(), fromStage: from, toStage: all[idx].currentStage });
    save(KEYS.pwstates, all);
    return all[idx];
  },
  // 基于最新评估 + 诊断标签推荐
  recommend(patientId: string): PathwaySuggestion[] {
    const p = patient.get(patientId);
    if (!p) return [];
    const records = assess.listRecords(patientId);
    const latest = records[0];
    const suggestions: PathwaySuggestion[] = [];
    for (const pw of PATHWAYS) {
      let fit = 0;
      let reason = "";
      // 类别匹配
      if (pw.category === p.category) {
        fit += 50;
        // 诊断标签匹配
        const indTags = pw.indication.split(";");
        const hit = indTags.filter((t) => p.diagnosis.includes(t) || p.tags.some((tag) => tag.includes(t)));
        fit += Math.min(30, hit.length * 15);
        reason = `诊断「${p.diagnosis}」与路径适应症「${pw.title}」高度匹配，覆盖 ${hit.length} 项关键指征。`;
      }
      // 评估记录匹配
      if (latest && latest.category === pw.category) {
        fit += 20;
        reason += ` 最近 ${latest.scaleTitle} 评估为「${latest.grade}」，建议进入对应阶段。`;
      }
      if (fit > 0) {
        suggestions.push({ pathway: pw, reason, fit: Math.min(100, fit) });
      }
    }
    return suggestions.sort((a, b) => b.fit - a.fit);
  },
};
