// 智能文本解析器：识别患者主诉、评估条目、病例描述
// 基于关键词与正则表达式匹配，将自由文本解析为结构化字段
import type { Patient } from "@/lib/types";

/**
 * 解析患者主诉/现病史/既往史/过敏史等自由文本
 * 返回 Partial<Patient>，仅包含可识别出的字段
 */
export function parsePatient(text: string): Partial<Patient> {
  if (!text || !text.trim()) return {};
  const result: Partial<Patient> & { chiefComplaint?: string; presentIllness?: string; pastHistory?: string; allergy?: string; phone?: string } = {};

  // 姓名识别：姓名为 2-4 个汉字，可前置"姓名："标识
  const nameMatch =
    text.match(/(?:姓\s*名|患\s*者|患者姓名)[:：\s]*([\u4e00-\u9fa5]{2,4})/) ||
    text.match(/^([\u4e00-\u9fa5]{2,4})[，,。\s]*(?:男|女|岁|患者|，|，)/m);
  if (nameMatch && nameMatch[1]) {
    const n = nameMatch[1].trim();
    // 过滤明显非姓名（黑名单：含"主诉"等）
    if (!/(主诉|现病|既往|过敏|电话|诊断|性)/.test(n)) {
      result.name = n;
    }
  }

  // 性别识别
  if (/女性|女[,，\s]|性别[：:]\s*女/.test(text)) {
    result.sex = "女";
  } else if (/男性|男[,，\s]|性别[：:]\s*男/.test(text)) {
    result.sex = "男";
  }

  // 年龄识别：X岁
  const ageMatch = text.match(/(?:年龄|年\s*龄)?\s*[：:]?\s*(\d{1,3})\s*岁/) || text.match(/(\d{1,3})\s*y\.?o\.?/i);
  if (ageMatch) {
    const a = parseInt(ageMatch[1], 10);
    if (a > 0 && a < 150) result.age = a;
  }

  // 电话识别
  const phoneMatch = text.match(/(?:电话|手机|联系方式|Tel)[:：\s]*([\d\-\s]{7,18})/);
  if (phoneMatch) {
    result.phone = phoneMatch[1].replace(/\s+/g, "").trim();
  }

  // 标签提取：抓取诊断相关的关键词
  const tagKeywords = [
    "偏瘫", "脑梗死", "脑出血", "脑卒中", "脊髓损伤", "骨折", "术后",
    "腰椎间盘突出", "颈椎病", "肩周炎", "肩袖损伤", "膝关节", "髋关节",
    "心衰", "冠心病", "COPD", "慢阻肺", "脑瘫", "发育迟缓", "高血压", "糖尿病",
  ];
  const tags: string[] = [];
  for (const kw of tagKeywords) {
    if (text.includes(kw) && !tags.includes(kw)) tags.push(kw);
  }
  if (tags.length) result.tags = tags;

  // 诊断识别：抓取"诊断："之后到句末/分号/换行
  const dxMatch = text.match(/(?:诊断|初步诊断|出院诊断|临床诊断)\s*[:：]\s*([^\n\r;；。]{2,60})/);
  if (dxMatch) {
    result.diagnosis = dxMatch[1].trim();
  } else if (tags.length) {
    // 退化：使用首个标签作为诊断概要
    result.diagnosis = tags[0];
  }

  // 亚专科判定
  const category = guessCategory(text);
  if (category) result.category = category;

  // 自由字段：主诉 / 现病史 / 既往史 / 过敏史
  const chief = extractSection(text, ["主诉", "主要症状"]);
  if (chief) result.chiefComplaint = chief;
  const present = extractSection(text, ["现病史", "病史摘要", "入院情况"]);
  if (present) result.presentIllness = present;
  const past = extractSection(text, ["既往史", "过去史", "既往病史"]);
  if (past) result.pastHistory = past;
  const allergy = extractSection(text, ["过敏史", "过敏"]);
  if (allergy) result.allergy = allergy;

  return result;
}

function extractSection(text: string, keys: string[]): string {
  for (const key of keys) {
    const re = new RegExp(`${key}\\s*[:：]\\s*([^\\n\\r]+)`);
    const m = text.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return "";
}

function guessCategory(text: string): Patient["category"] | undefined {
  if (/脑卒中|脑梗死|脑出血|脑外伤|偏瘫|截瘫|脊髓损伤|帕金森|周围神经|面瘫/.test(text)) return "neuro";
  if (/肩周炎|腰椎间盘|颈椎病|骨折|术后|肌腱|韧带|半月板|髋关节置换|膝关节|肩袖|网球肘/.test(text)) return "musculo";
  if (/冠心病|心衰|心梗|心肌梗死|COPD|慢阻肺|肺炎|肺心病|心脏康复|心肺/.test(text)) return "cardio";
  if (/脑瘫|发育迟缓|自闭|多动|唐氏|小儿|儿童/.test(text)) return "pediatric";
  return undefined;
}

/**
 * 解析评估医嘱/查体文字为结构化数据
 * scaleType: 量表类型标识（用于推断维度）
 * 返回 questionId -> score 映射，questionId 形如 vas/q1/q2 等
 */
export function parseAssessment(text: string, scaleType: string = ""): Record<string, unknown> {
  if (!text || !text.trim()) return {};
  const result: Record<string, unknown> = {};

  // VAS 评分：0-10
  const vasMatch = text.match(/VAS\s*[评分]*\s*[:：]?\s*(\d{1,2})(?:\s*\/\s*10)?/i) || text.match(/疼痛评分\s*[:：]?\s*(\d{1,2})/);
  if (vasMatch) {
    const v = clamp(parseInt(vasMatch[1], 10), 0, 10);
    result.vas = v;
    result["vas_score"] = v;
  }

  // 关节 ROM 角度：屈伸/外展/内收等
  // 例：左肩前屈 120° / 屈曲 90°
  const romRegex = /([\u4e00-\u9fa5A-Za-z]*[肩肘腕髋膝踝腰颈])\s*(前屈|后伸|外展|内收|外旋|内旋|屈曲|伸展|旋转|侧屈)\s*[为是]?\s*(\d{1,3})\s*[°度]/g;
  let m: RegExpExecArray | null;
  const roms: { joint: string; movement: string; angle: number }[] = [];
  while ((m = romRegex.exec(text)) !== null) {
    roms.push({ joint: m[1], movement: m[2], angle: parseInt(m[3], 10) });
  }
  if (roms.length) {
    result.rom = roms;
    roms.forEach((r, i) => {
      result[`rom_${i}_${r.joint}_${r.movement}`] = r.angle;
    });
  }

  // 肌力：0–5 级
  // 例：左肱二头肌肌力 4 级 / 肌力 4/5
  const strengthRegex = /([\u4e00-\u9fa5A-Za-z]*?肌)力?\s*[为是]?\s*([0-5])\s*[级/]/g;
  const strengths: { muscle: string; level: number }[] = [];
  while ((m = strengthRegex.exec(text)) !== null) {
    strengths.push({ muscle: m[1] + "力", level: parseInt(m[2], 10) });
  }
  if (strengths.length) {
    result.strength = strengths;
    strengths.forEach((s, i) => {
      result[`strength_${i}_${s.muscle}`] = s.level;
    });
  }

  // 徒手肌力检查：MMT 4/5
  const mmtMatch = text.match(/MMT\s*[:：]?\s*([0-5])\s*\/\s*5/i);
  if (mmtMatch) result.mmt = parseInt(mmtMatch[1], 10);

  // Barthel 指数
  const barthelMatch = text.match(/Barthel\s*(?:指数|评分)\s*[:：]?\s*(\d{1,3})/i) || text.match(/巴氏指数\s*[:：]?\s*(\d{1,3})/);
  if (barthelMatch) result.barthel = parseInt(barthelMatch[1], 10);

  // 肌张力：Ashworth 评级
  const ashMatch = text.match(/Ashworth\s*[:：]?\s*([0-4]\+?)/i) || text.match(/肌张力\s*[:：]?\s*([0-4]\+?)\s*级/);
  if (ashMatch) result.ashworth = ashMatch[1];

  // 改良 Ashworth 量表（缩写 MAS）
  const masMatch = text.match(/MAS\s*[:：]?\s*([0-4]\+?)/i);
  if (masMatch) result.mas = masMatch[1];

  // 平衡：Berg / Tinetti
  const bergMatch = text.match(/Berg\s*(?:评分|量表)?\s*[:：]?\s*(\d{1,3})/i);
  if (bergMatch) result.berg = parseInt(bergMatch[1], 10);
  const tinettiMatch = text.match(/Tinetti\s*[:：]?\s*(\d{1,3})/i);
  if (tinettiMatch) result.tinetti = parseInt(tinettiMatch[1], 10);

  // 步速 / 6 分钟步行距离
  const walkMatch = text.match(/(?:6\s*分钟步行距离|6MWD|6MWT)\s*[:：]?\s*(\d{1,4})\s*m/i);
  if (walkMatch) result.walk6min = parseInt(walkMatch[1], 10);

  // FIM
  const fimMatch = text.match(/FIM\s*[:：]?\s*(\d{2,3})/i);
  if (fimMatch) result.fim = parseInt(fimMatch[1], 10);

  // 简单根据 scaleType 推断使用哪些 key
  if (scaleType) {
    const lower = scaleType.toLowerCase();
    if (lower.includes("vas") && result.vas !== undefined) result.q1 = result.vas;
    if (lower.includes("barthel") && result.barthel !== undefined) result.score = result.barthel;
    if (lower.includes("berg") && result.berg !== undefined) result.score = result.berg;
  }

  return result;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * 解析病例描述：返回 tags 与路径推荐
 */
export function parseCase(text: string): { tags: string[]; suggestions: string[] } {
  if (!text || !text.trim()) return { tags: [], suggestions: [] };

  const tagMap: Record<string, string[]> = {
    neuro: [
      "脑卒中", "脑梗死", "脑出血", "偏瘫", "脑外伤", "颅脑损伤", "脊髓损伤",
      "截瘫", "四肢瘫", "面瘫", "周围神经", "帕金森", "脑瘫", "多发性硬化",
    ],
    musculo: [
      "腰椎间盘突出", "颈椎病", "肩周炎", "肩袖损伤", "骨折", "术后", "关节置换",
      "膝关节", "髋关节", "半月板", "韧带", "肌腱", "网球肘", "腱鞘炎",
    ],
    cardio: ["冠心病", "心衰", "心肌梗死", "COPD", "慢阻肺", "肺炎", "心肺", "心绞痛"],
    pediatric: ["脑瘫", "发育迟缓", "自闭症", "多动症", "唐氏综合征", "小儿"],
  };

  const tags: string[] = [];
  const matchedCategories: Set<string> = new Set();
  for (const [cat, keywords] of Object.entries(tagMap)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        tags.push(kw);
        matchedCategories.add(cat);
      }
    }
  }

  // 简单的路径建议：基于类别
  const suggestions: string[] = [];
  const categorySuggestionMap: Record<string, string[]> = {
    neuro: ["脑卒中后偏瘫康复路径", "脊髓损伤分级路径", "周围神经修复路径"],
    musculo: ["腰椎间盘突出非手术路径", "关节置换术后康复路径", "运动损伤康复路径"],
    cardio: ["冠心病心脏康复路径", "COPD 肺康复路径"],
    pediatric: ["脑瘫儿童早期干预路径", "发育迟缓促进路径"],
  };
  for (const cat of matchedCategories) {
    const list = categorySuggestionMap[cat];
    if (list) suggestions.push(...list);
  }

  return { tags: Array.from(new Set(tags)), suggestions: Array.from(new Set(suggestions)) };
}
