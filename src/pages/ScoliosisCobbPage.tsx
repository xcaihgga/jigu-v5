import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScanLine,
  ChevronRight,
  Check,
  X,
  User,
  Trash2,
  RotateCcw,
  AlertCircle,
  Plus,
} from "lucide-react";
import { scoliosis, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

export default function ScoliosisCobbPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [xrayImage, setXrayImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [primaryAngle, setPrimaryAngle] = useState(0);
  const [secondaryAngle, setSecondaryAngle] = useState(0);
  const [curveType, setCurveType] = useState<"C型" | "S型">("C型");
  const [primaryLocation, setPrimaryLocation] = useState<"胸椎" | "腰椎" | "胸腰椎" | "双弯">("胸椎");
  const [secondaryLocation, setSecondaryLocation] = useState<"胸椎" | "腰椎" | "胸腰椎" | "双弯">("腰椎");
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSecondary, setShowSecondary] = useState(false);
  const [measurementNotes, setMeasurementNotes] = useState("");

  const patients = patient.list(user?.id ?? "");

  useEffect(() => {
    if (!xrayImage) return;

    const img = new Image();
    img.src = xrayImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
      setImageScale(scale);
      setImageOffset({
        x: (containerWidth - img.width * scale) / 2,
        y: (containerHeight - img.height * scale) / 2,
      });

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (containerWidth - img.width * scale) / 2, (containerHeight - img.height * scale) / 2, img.width * scale, img.height * scale);
    };
  }, [xrayImage]);

  useEffect(() => {
    redrawCanvas();
  }, [lines, currentLine, imageOffset, imageScale]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !xrayImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = xrayImage;
    ctx.drawImage(img, imageOffset.x, imageOffset.y, img.width * imageScale, img.height * imageScale);

    ctx.strokeStyle = "#0F4C4A";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#0F4C4A";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(line.end.x, line.end.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    if (currentLine) {
      ctx.beginPath();
      ctx.moveTo(currentLine.start.x, currentLine.start.y);
      ctx.lineTo(currentLine.end.x, currentLine.end.y);
      ctx.strokeStyle = "#E8654A";
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(currentLine.start.x, currentLine.start.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#E8654A";
      ctx.fill();
    }

    if (lines.length >= 2) {
      const angle = calculateAngle(lines[0], lines[1]);
      ctx.strokeStyle = "#E8654A";
      ctx.lineWidth = 3;
      ctx.setLineDash([]);

      const mid1 = {
        x: (lines[0].start.x + lines[0].end.x) / 2,
        y: (lines[0].start.y + lines[0].end.y) / 2,
      };
      const mid2 = {
        x: (lines[1].start.x + lines[1].end.x) / 2,
        y: (lines[1].start.y + lines[1].end.y) / 2,
      };

      ctx.beginPath();
      ctx.moveTo(mid1.x, mid1.y);
      ctx.lineTo(mid2.x, mid2.y);
      ctx.stroke();

      const anglePos = {
        x: (mid1.x + mid2.x) / 2,
        y: (mid1.y + mid2.y) / 2 - 30,
      };

      ctx.fillStyle = "#E8654A";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${angle.toFixed(1)}°`, anglePos.x, anglePos.y);
    }
  }, [xrayImage, lines, currentLine, imageOffset, imageScale]);

  const calculateAngle = (line1: Line, line2: Line): number => {
    const dx1 = line1.end.x - line1.start.x;
    const dy1 = line1.end.y - line1.start.y;
    const dx2 = line2.end.x - line2.start.x;
    const dy2 = line2.end.y - line2.start.y;

    const dot = dx1 * dx2 + dy1 * dy2;
    const mag1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const mag2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (mag1 === 0 || mag2 === 0) return 0;

    const angle = Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
    return Math.min(angle, 180 - angle);
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!currentLine) {
      setCurrentLine({ start: { x, y }, end: { x, y } });
    } else {
      const newLine: Line = { start: currentLine.start, end: { x, y } };
      setLines([...lines, newLine]);
      setCurrentLine(null);

      if (lines.length + 1 === 2) {
        const angle = calculateAngle(lines[0], newLine);
        setPrimaryAngle(angle);
      }
      if (lines.length + 1 === 4) {
        const angle = calculateAngle(lines[2], newLine);
        setSecondaryAngle(angle);
      }
    }
  }, [currentLine, lines]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentLine || isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentLine({ ...currentLine, end: { x, y } });
  }, [currentLine, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentLine) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [currentLine]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (currentLine) {
      setCurrentLine(null);
    }
    setIsDragging(false);
  }, [currentLine]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, imageScale * delta));
    setImageScale(newScale);
  }, [imageScale]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setXrayImage(event.target?.result as string);
      setLines([]);
      setCurrentLine(null);
      setPrimaryAngle(0);
      setSecondaryAngle(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
    setCurrentLine(null);
    setPrimaryAngle(0);
    setSecondaryAngle(0);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedPatient) {
      alert("请选择患者");
      return;
    }

    const measurement = scoliosis.createCobbMeasurement({
      patientId: selectedPatient,
      xrayImage: xrayImage ?? undefined,
      primaryCurveAngle: primaryAngle,
      primaryCurveLocation: primaryLocation,
      secondaryCurveAngle: showSecondary ? secondaryAngle : undefined,
      secondaryCurveLocation: showSecondary ? secondaryLocation : undefined,
      curveType,
      measurementNotes,
      createdBy: user?.id ?? "",
    });

    alert("Cobb角度测量已保存");
    navigate("/scoliosis");
  }, [selectedPatient, xrayImage, primaryAngle, primaryLocation, secondaryAngle, secondaryLocation, curveType, measurementNotes, user, navigate, showSecondary]);

  return (
    <div className="space-y-6 stagger max-w-6xl mx-auto">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-text">Cobb Angle Measurement</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">Cobb角度测量</h1>
          <p className="text-sm text-ink-mute mt-1">
            基于X线影像测量脊柱侧弯角度，确定主弯和次弯位置
          </p>
        </div>
        <button onClick={() => navigate("/scoliosis")} className="btn-ghost">
          返回
        </button>
      </section>

      <div className="flex items-center gap-4 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full text-xs font-medium",
                step >= s
                  ? "bg-teal-500 text-cream-50"
                  : "bg-cream-200 text-ink-faint",
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span
              className={cn(
                "text-sm",
                step >= s ? "text-ink" : "text-ink-faint",
              )}
            >
              {s === 1 ? "选择患者" : s === 2 ? "上传影像" : "角度测量"}
            </span>
            {s < 3 && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 mx-1",
                  step > s ? "text-teal-500" : "text-ink-faint",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <section className="card p-6">
          <h2 className="section-title mb-4">选择患者</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {patients.length === 0 ? (
              <div className="col-span-full py-8 text-center text-sm text-ink-faint">
                <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                暂无患者，请先在患者档案中添加
              </div>
            ) : (
              patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded border text-left transition-all",
                    selectedPatient === p.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-line hover:border-teal-400",
                  )}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 text-cream-50 text-sm font-medium">
                    {p.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-2xs text-ink-mute">{p.age}岁 · {p.sex}</p>
                  </div>
                  {selectedPatient === p.id && (
                    <Check className="h-4 w-4 text-teal-500 ml-auto" />
                  )}
                </button>
              ))
            )}
          </div>
          <button
            onClick={() => selectedPatient && setStep(2)}
            disabled={!selectedPatient}
            className={cn(
              "btn-primary mt-6",
              !selectedPatient && "opacity-50 cursor-not-allowed",
            )}
          >
            下一步
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="card p-6">
          <h2 className="section-title mb-4">上传X线影像</h2>
          <div
            className={cn(
              "relative aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all",
              xrayImage
                ? "border-teal-400 bg-teal-50/30"
                : "border-line hover:border-teal-400",
            )}
          >
            {xrayImage ? (
              <>
                <img
                  src={xrayImage}
                  alt="X线影像"
                  className="w-full h-full object-contain rounded"
                />
                <button
                  onClick={() => setXrayImage(null)}
                  className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="text-center">
                <ScanLine className="h-10 w-10 text-ink-faint mx-auto mb-3" />
                <p className="text-sm text-ink-mute">点击上传X线影像</p>
                <p className="text-2xs text-ink-faint mt-1">支持 JPG、PNG 格式</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>

          <div className="mt-6 p-4 rounded bg-amber-soft/20 border border-amber-soft/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-amber-dark mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-dark">影像要求</p>
                <ul className="text-2xs text-ink-mute mt-1 space-y-1">
                  <li>• 需为脊柱全长正位片</li>
                  <li>• 图像清晰，对比度良好</li>
                  <li>• 包含完整的胸椎和腰椎</li>
                  <li>• 患者处于站立位拍摄</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost">
              返回
            </button>
            <button
              onClick={() => xrayImage && setStep(3)}
              disabled={!xrayImage}
              className={cn(
                "btn-primary",
                !xrayImage && "opacity-50 cursor-not-allowed",
              )}
            >
              下一步
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <div className="grid lg:grid-cols-[3fr_1fr] gap-4">
          <section className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">测量区域</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearLines}
                  className="btn-ghost btn-sm flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  重置
                </button>
              </div>
            </div>

            <div
              ref={containerRef}
              className="relative bg-cream-50 rounded-lg overflow-hidden border border-line"
              style={{ height: "500px" }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
                className="w-full h-full cursor-crosshair"
              />

              {lines.length < 2 && (
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 text-white rounded-lg text-sm">
                  <p className="font-medium mb-1">Cobb角测量步骤</p>
                  <ol className="text-2xs space-y-1 list-decimal list-inside">
                    <li>点击选择主弯上端椎体上终板</li>
                    <li>再次点击绘制第一条线（上端倾斜线）</li>
                    <li>点击选择主弯下端椎体下终板</li>
                    <li>再次点击绘制第二条线（下端倾斜线）</li>
                    <li>系统自动计算两条线的夹角</li>
                  </ol>
                </div>
              )}

              {lines.length >= 2 && !showSecondary && (
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={() => setShowSecondary(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> 添加次弯测量
                  </button>
                </div>
              )}

              {showSecondary && lines.length >= 4 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={() => {
                      setShowSecondary(false);
                      setLines(lines.slice(0, 2));
                      setSecondaryAngle(0);
                    }}
                    className="w-full btn-coral flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> 移除次弯测量
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink-mute">滚动鼠标滚轮缩放 · 拖拽平移</span>
              <span className="text-ink-mute">已绘制 {lines.length} 条线</span>
            </div>
          </section>

          <section className="card p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-ink mb-3">测量结果</h3>
              <div className="p-4 rounded bg-teal-50 border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xs text-ink-mute">主弯角度</span>
                  <span className="stat-num text-2xl text-teal-600">{primaryAngle.toFixed(1)}°</span>
                </div>
                <div className="h-1.5 rounded-full bg-teal-200 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${Math.min(100, primaryAngle)}%` }}
                  />
                </div>
              </div>

              {showSecondary && (
                <div className="p-4 rounded bg-amber-soft/30 border border-amber-soft/40 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs text-ink-mute">次弯角度</span>
                    <span className="stat-num text-2xl text-amber-dark">{secondaryAngle.toFixed(1)}°</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-amber-soft/40 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${Math.min(100, secondaryAngle)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-2 block">侧弯类型</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurveType("C型")}
                  className={cn(
                    "flex-1 py-2 rounded border text-sm transition-all",
                    curveType === "C型"
                      ? "border-teal-500 bg-teal-50 text-teal-600"
                      : "border-line hover:border-teal-400",
                  )}
                >
                  C型（单弯）
                </button>
                <button
                  onClick={() => setCurveType("S型")}
                  className={cn(
                    "flex-1 py-2 rounded border text-sm transition-all",
                    curveType === "S型"
                      ? "border-teal-500 bg-teal-50 text-teal-600"
                      : "border-line hover:border-teal-400",
                  )}
                >
                  S型（双弯）
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-2 block">主弯位置</label>
              <select
                value={primaryLocation}
                onChange={(e) => setPrimaryLocation(e.target.value as any)}
                className="input"
              >
                <option value="胸椎">胸椎</option>
                <option value="腰椎">腰椎</option>
                <option value="胸腰椎">胸腰椎</option>
                <option value="双弯">双弯</option>
              </select>
            </div>

            {showSecondary && (
              <div>
                <label className="text-sm font-medium text-ink mb-2 block">次弯位置</label>
                <select
                  value={secondaryLocation}
                  onChange={(e) => setSecondaryLocation(e.target.value as any)}
                  className="input"
                >
                  <option value="胸椎">胸椎</option>
                  <option value="腰椎">腰椎</option>
                  <option value="胸腰椎">胸腰椎</option>
                  <option value="双弯">双弯</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-ink mb-2 block">测量备注</label>
              <textarea
                value={measurementNotes}
                onChange={(e) => setMeasurementNotes(e.target.value)}
                className="input resize-none h-20"
                placeholder="记录测量过程中的重要信息..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-line">
              <button onClick={() => setStep(2)} className="btn-ghost">
                返回
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                保存测量
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}