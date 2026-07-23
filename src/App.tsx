import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import Layout from "@/components/Layout";
import Toaster from "@/components/ui/Toaster";
import Login from "@/pages/Login";

// 路由级懒加载：每个页面拆分为独立 chunk，按需加载
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AssessCenter = lazy(() => import("@/pages/AssessCenter"));
const AssessRunner = lazy(() => import("@/pages/AssessRunner"));
const AssessReport = lazy(() => import("@/pages/AssessReport"));
const PlanList = lazy(() => import("@/pages/PlanList"));
const PlanEditor = lazy(() => import("@/pages/PlanEditor"));
const PathwayPage = lazy(() => import("@/pages/PathwayPage"));
const PatientsPage = lazy(() => import("@/pages/PatientsPage"));
const PatientDetail = lazy(() => import("@/pages/PatientDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const QuizPage = lazy(() => import("@/pages/QuizPage"));
const TreatmentHubPage = lazy(() => import("@/pages/TreatmentHubPage"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const ReferencePage = lazy(() => import("@/pages/ReferencePage"));

// 简单加载占位，避免白屏
function PageFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-stone-400">
      <div className="animate-pulse text-sm">加载中…</div>
    </div>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
            <Route path="/assess" element={<Suspense fallback={<PageFallback />}><AssessCenter /></Suspense>} />
            <Route path="/assess/:scaleId" element={<Suspense fallback={<PageFallback />}><AssessRunner /></Suspense>} />
            <Route path="/assess/:scaleId/report/:recordId" element={<Suspense fallback={<PageFallback />}><AssessReport /></Suspense>} />
            <Route path="/treatment" element={<Suspense fallback={<PageFallback />}><TreatmentHubPage /></Suspense>} />
            <Route path="/plan" element={<Suspense fallback={<PageFallback />}><PlanList /></Suspense>} />
            <Route path="/plan/:planId" element={<Suspense fallback={<PageFallback />}><PlanEditor /></Suspense>} />
            <Route path="/pathway" element={<Suspense fallback={<PageFallback />}><PathwayPage /></Suspense>} />
            <Route path="/reference" element={<Suspense fallback={<PageFallback />}><ReferencePage /></Suspense>} />
            <Route path="/patients" element={<Suspense fallback={<PageFallback />}><PatientsPage /></Suspense>} />
            <Route path="/patients/:patientId" element={<Suspense fallback={<PageFallback />}><PatientDetail /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageFallback />}><Profile /></Suspense>} />
            <Route path="/quiz" element={<Suspense fallback={<PageFallback />}><QuizPage /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<PageFallback />}><AdminUsers /></Suspense>} />
            <Route path="/pain" element={<Navigate to="/treatment" replace />} />
            <Route path="/neuro-extras" element={<Navigate to="/pathway" replace />} />
            <Route path="/docs" element={<Navigate to="/profile" replace />} />
            <Route path="/progress" element={<Navigate to="/plan" replace />} />
            <Route path="/plan/hub" element={<Navigate to="/treatment" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
