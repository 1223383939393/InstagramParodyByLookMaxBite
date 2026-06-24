// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import FeedPage from "./pages/FeedPage";
import ExplorePage from "./pages/ExplorePage";
import NewPostPage from "./pages/NewPostPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("lmbq_token");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const hasToken = Boolean(localStorage.getItem("lmbq_token"));

  return (
    <BrowserRouter>
      <Routes>
        {/* корень: редирект по наличию токена */}
        <Route
          path="/"
          element={
            hasToken ? (
              <Navigate to="/feed" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* публичная страница авторизации */}
        <Route path="/auth" element={<AuthPage />} />

        {/* защищённый layout со вложенными страницами */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <ProtectedLayout />
            </RequireAuth>
          }
        >
          <Route path="feed" element={<FeedPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="new" element={<NewPostPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}