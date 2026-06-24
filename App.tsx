// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import FeedPage from "./pages/FeedPage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NewPostPage from "./pages/NewPostPage";
import Sidebar from "./components/layout/Sidebar";

function ProtectedLayout() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.users.isAuthenticated
  );

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/new" element={<NewPostPage />} />
          <Route path="*" element={<FeedPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}