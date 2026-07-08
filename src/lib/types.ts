// 康衡平台核心类型定义

export type Role = "therapist" | "patient" | "visitor";

export type Category = "musculo" | "neuro" | "cardio" | "pediatric";

export type Level = "screening" | "intermediate" | "specialty";

export interface User {
  id: string;
  email: string;
  password: string; // mock，明文存储，仅演示
  role: Role;
  name: string;
  license?: string; // 执业编号（治疗师选填）
  createdAt: number;
}

export interface Patient {
  id: string;
  therapistId: string;
  name: string;
  age: number;
  sex: "男" | "女";
  diagnosis: string;
  category: Category;
  tags: string[];
  createdAt: number;
}

export interface ScaleOption {
  label: string;
  score: number;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  dimension: string;
  options: ScaleOption[];
}

export interface Scale {
  id: string;
  category: Category;
  level: Level;
  title: string;
  abbr: string;
  subtitle: string;
  scenario: string;
  estMinutes: number;
  dimensions: string[];
  questions: ScaleQuestion[];
  // 计分分级阈值：按总分百分比划分 grade
  grading: { max: number; grades: { label: string; min: number; tone: "good" | "warn" | "bad" }[] };
}

export interface AssessmentRecord {
  id: string;
  scaleId: string;
  scaleTitle: string;
  category: Category;
  patientId: string;
  patientName: string;
  therapistId: string;
  answers: Record<string, number>; // questionId -> 选中的 score
  totalScore: number;
  maxScore: number;
  grade: string;
  tone: "good" | "warn" | "bad";
  dimensionScores: { dimension: string; score: number; max: number }[];
  takenAt: number;
}

export interface Exercise {
  id: string;
  title: string;
  bodyPart: string;
  goal: string;
  cue: string; // 动作要点
  defaultSets: number;
  defaultReps: number;
}

export interface PlanEntry {
  exerciseId: string;
  sets: number;
  reps: number;
  load?: string;
  note?: string;
}

export interface Plan {
  id: string;
  patientId: string;
  patientName: string;
  recordId?: string;
  title: string;
  goal: string;
  // 7 天日程：周一..周日
  schedule: { day: number; entries: PlanEntry[] }[];
  durationWeeks: number;
  createdAt: number;
  active: boolean;
}

export interface CheckinEntry {
  exerciseId: string;
  done: boolean;
  rpe: number; // 主观费力 0-10
}

export interface Checkin {
  id: string;
  planId: string;
  patientId: string;
  dayKey: string; // YYYY-MM-DD
  entries: CheckinEntry[];
  rpe: number; // 综合 RPE
  note?: string;
  createdAt: number;
}

export interface PathwayStage {
  index: number;
  title: string;
  window: string; // 时间窗
  goal: string;
  keyActions: string[];
  milestone: string; // 进入下一阶段的达标标志
  referral?: string; // 转介提示
}

export interface Pathway {
  id: string;
  category: Category;
  title: string;
  summary: string;
  indication: string; // 适应症标签
  stages: PathwayStage[];
}

export interface PathwayState {
  id: string;
  patientId: string;
  pathwayId: string;
  currentStage: number;
  startedAt: number;
  history: { at: number; fromStage: number; toStage: number }[];
}

export interface PathwaySuggestion {
  pathway: Pathway;
  reason: string;
  fit: number; // 匹配度 0-100
}
