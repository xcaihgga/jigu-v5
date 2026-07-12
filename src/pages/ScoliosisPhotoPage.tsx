import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  User,
  Ruler,
  ChevronRight,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { scoliosis, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

export default function ScoliosisPhotoPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [shoulderLevel, setShoulderLevel] = useState(0);
  const [waistSymmetry, setWaistSymmetry] = useState(0);
  const [hipLevel, setHipLevel] = useState(0);
  const [bodyShift, setBodyShift] = useState(0);
  const [step, setStep] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const patients = patient.list(user?.id ?? "");

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "front" | "side") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === "front") {
        setFrontImage(result);
      } else {
        setSideImage(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCapture = useCallback((type: "front" | "side") => {
    const constraints = { video: { facingMode: "user" } };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          if (type === "front") {
            setFrontImage(dataUrl);
          } else {
            setSideImage(dataUrl);
          }
        }
        stream.getTracks().forEach((track) => track.stop());
      };
    }).catch(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedPatient) {
      alert("请选择患者");
      return;
    }

    const photoRecord = scoliosis.createPhoto({
      patientId: selectedPatient,
      frontImage: frontImage ?? undefined,
      sideImage: sideImage ?? undefined,
      shoulderLevel,
      waistSymmetry,
      hipLevel,
      bodyShift,
      createdBy: user?.id ?? "",
    });

    alert("拍照评估已保存");
    navigate("/scoliosis");
  }, [selectedPatient, frontImage, sideImage, shoulderLevel, waistSymmetry, hipLevel, bodyShift, user, navigate]);

  const getLevelLabel = (value: number): string => {
    if (value === 0) return "正常/平齐";
    if (value <= 3) return "轻微";
    if (value <= 6) return "中度";
    if (value <= 8) return "明显";
    return "严重";
  };

  const getLevelColor = (value: number): string => {
    if (value === 0) return "bg-teal-500";
    if (value <= 3) return "bg-teal-400";
    if (value <= 6) return "bg-amber-500";
    if (value <= 8) return "bg-coral";
    return "bg-red-600";
  };

  return (
    <div className="space-y-6 stagger max-w-4xl mx-auto">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-text">Photo Assessment</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">拍照筛查评估</h1>
          <p className="text-sm text-ink-mute mt-1">
            通过拍摄患者前后位照片，评估肩部、腰部、臀部对称性及身体偏移情况
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
              {s === 1 ? "选择患者" : s === 2 ? "上传照片" : "形态评估"}
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
          <h2 className="section-title mb-4">上传照片</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-ink">正面照片</p>
              <div
                className={cn(
                  "relative aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all",
                  frontImage
                    ? "border-teal-400 bg-teal-50/30"
                    : "border-line hover:border-teal-400",
                )}
              >
                {frontImage ? (
                  <>
                    <img
                      src={frontImage}
                      alt="正面照"
                      className="w-full h-full object-contain rounded"
                    />
                    <button
                      onClick={() => setFrontImage(null)}
                      className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-ink-faint mx-auto mb-2" />
                    <p className="text-sm text-ink-mute">点击或拍照上传</p>
                    <p className="text-2xs text-ink-faint mt-1">建议白色背景，穿着紧身衣</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, "front")}
                />
                <button
                  onClick={() => handleCapture("front")}
                  className="absolute bottom-3 right-3 btn-primary btn-sm"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-ink">侧面照片</p>
              <div
                className={cn(
                  "relative aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all",
                  sideImage
                    ? "border-teal-400 bg-teal-50/30"
                    : "border-line hover:border-teal-400",
                )}
              >
                {sideImage ? (
                  <>
                    <img
                      src={sideImage}
                      alt="侧面照"
                      className="w-full h-full object-contain rounded"
                    />
                    <button
                      onClick={() => setSideImage(null)}
                      className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-ink-faint mx-auto mb-2" />
                    <p className="text-sm text-ink-mute">点击或拍照上传</p>
                    <p className="text-2xs text-ink-faint mt-1">评估脊柱前后弯曲</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, "side")}
                />
                <button
                  onClick={() => handleCapture("side")}
                  className="absolute bottom-3 right-3 btn-primary btn-sm"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded bg-amber-soft/20 border border-amber-soft/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-amber-dark mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-dark">拍摄注意事项</p>
                <ul className="text-2xs text-ink-mute mt-1 space-y-1">
                  <li>• 患者站立姿势端正，双脚并拢，双臂自然下垂</li>
                  <li>• 背景为纯色，避免干扰评估</li>
                  <li>• 拍摄距离适当，确保全身入镜</li>
                  <li>• 光线均匀，避免阴影遮挡</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost">
              返回
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-primary"
            >
              下一步
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card p-6">
          <h2 className="section-title mb-4">形态评估</h2>

          {(frontImage || sideImage) && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {frontImage && (
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-line">
                  <img
                    src={frontImage}
                    alt="正面照"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {sideImage && (
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-line">
                  <img
                    src={sideImage}
                    alt="侧面照"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink">肩部水平</label>
                <span className={cn("text-sm font-medium", getLevelLabel(shoulderLevel) === "正常/平齐" ? "text-teal-600" : getLevelLabel(shoulderLevel) === "轻微" ? "text-teal-500" : getLevelLabel(shoulderLevel) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {getLevelLabel(shoulderLevel)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={shoulderLevel}
                onChange={(e) => setShoulderLevel(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-cream-200 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--teal) 0%, var(--teal) ${shoulderLevel * 10}%, #e4dfd0 ${shoulderLevel * 10}%, #e4dfd0 100%)`,
                }}
              />
              <div className="flex justify-between text-2xs text-ink-faint mt-1">
                <span>平齐</span>
                <span>轻微</span>
                <span>中度</span>
                <span>明显</span>
                <span>严重</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink">腰部对称性</label>
                <span className={cn("text-sm font-medium", getLevelLabel(waistSymmetry) === "正常/平齐" ? "text-teal-600" : getLevelLabel(waistSymmetry) === "轻微" ? "text-teal-500" : getLevelLabel(waistSymmetry) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {getLevelLabel(waistSymmetry)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={waistSymmetry}
                onChange={(e) => setWaistSymmetry(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-cream-200 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--teal) 0%, var(--teal) ${waistSymmetry * 10}%, #e4dfd0 ${waistSymmetry * 10}%, #e4dfd0 100%)`,
                }}
              />
              <div className="flex justify-between text-2xs text-ink-faint mt-1">
                <span>对称</span>
                <span>轻微</span>
                <span>中度</span>
                <span>明显</span>
                <span>严重</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink">臀部水平</label>
                <span className={cn("text-sm font-medium", getLevelLabel(hipLevel) === "正常/平齐" ? "text-teal-600" : getLevelLabel(hipLevel) === "轻微" ? "text-teal-500" : getLevelLabel(hipLevel) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {getLevelLabel(hipLevel)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={hipLevel}
                onChange={(e) => setHipLevel(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-cream-200 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--teal) 0%, var(--teal) ${hipLevel * 10}%, #e4dfd0 ${hipLevel * 10}%, #e4dfd0 100%)`,
                }}
              />
              <div className="flex justify-between text-2xs text-ink-faint mt-1">
                <span>平齐</span>
                <span>轻微</span>
                <span>中度</span>
                <span>明显</span>
                <span>严重</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink">身体偏移</label>
                <span className={cn("text-sm font-medium", getLevelLabel(bodyShift) === "正常/平齐" ? "text-teal-600" : getLevelLabel(bodyShift) === "轻微" ? "text-teal-500" : getLevelLabel(bodyShift) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {getLevelLabel(bodyShift)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={bodyShift}
                onChange={(e) => setBodyShift(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-cream-200 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--teal) 0%, var(--teal) ${bodyShift * 10}%, #e4dfd0 ${bodyShift * 10}%, #e4dfd0 100%)`,
                }}
              />
              <div className="flex justify-between text-2xs text-ink-faint mt-1">
                <span>居中</span>
                <span>轻微</span>
                <span>中度</span>
                <span>明显</span>
                <span>严重</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded bg-teal-50 border border-teal-200">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">评估结果汇总</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 rounded bg-white">
                <p className="text-2xs text-ink-mute">肩部</p>
                <p className={cn("stat-num text-lg", getLevelLabel(shoulderLevel) === "正常/平齐" ? "text-teal-600" : getLevelLabel(shoulderLevel) === "轻微" ? "text-teal-500" : getLevelLabel(shoulderLevel) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {shoulderLevel}/10
                </p>
              </div>
              <div className="text-center p-2 rounded bg-white">
                <p className="text-2xs text-ink-mute">腰部</p>
                <p className={cn("stat-num text-lg", getLevelLabel(waistSymmetry) === "正常/平齐" ? "text-teal-600" : getLevelLabel(waistSymmetry) === "轻微" ? "text-teal-500" : getLevelLabel(waistSymmetry) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {waistSymmetry}/10
                </p>
              </div>
              <div className="text-center p-2 rounded bg-white">
                <p className="text-2xs text-ink-mute">臀部</p>
                <p className={cn("stat-num text-lg", getLevelLabel(hipLevel) === "正常/平齐" ? "text-teal-600" : getLevelLabel(hipLevel) === "轻微" ? "text-teal-500" : getLevelLabel(hipLevel) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {hipLevel}/10
                </p>
              </div>
              <div className="text-center p-2 rounded bg-white">
                <p className="text-2xs text-ink-mute">偏移</p>
                <p className={cn("stat-num text-lg", getLevelLabel(bodyShift) === "正常/平齐" ? "text-teal-600" : getLevelLabel(bodyShift) === "轻微" ? "text-teal-500" : getLevelLabel(bodyShift) === "中度" ? "text-amber-dark" : "text-coral")}>
                  {bodyShift}/10
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="btn-ghost">
              返回
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              保存评估
            </button>
          </div>
        </section>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}