import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import FeedPage from "./pages/FeedPage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import NewPostPage from "./pages/NewPostPage";

export default function App() {
  return (
    <Routes>
      {/* Корневой маршрут: либо AuthPage (через ProtectedLayout),
          либо основной layout с Sidebar и вложенными страницами */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="feed" element={<FeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:userId" element={<ProfilePage />} />
        <Route path="new" element={<NewPostPage />} />

        {/* дефолтный переход внутрь приложения, сработает только для залогиненных */}
        <Route index element={<Navigate to="/feed" replace />} />
      </Route>

      {/* если человек попал на какой‑то левый URL — отправляем на корень */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}