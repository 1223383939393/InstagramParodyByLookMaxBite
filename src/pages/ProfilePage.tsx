// src/pages/ProfilePage.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import PostCard from "../components/feed/PostCard";
import { updateProfile } from "../store/usersSlice";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { DEFAULT_AVATAR } from "../constants/avatar";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { userId } = useParams<{ userId: string }>();
  const usersState = useSelector((state: RootState) => state.users);

  const activeUserId = userId ?? usersState.currentUserId;

  const profile = usersState.items.find(
    (u) => u.id === activeUserId
  );

  const posts = useSelector((state: RootState) =>
    state.posts.items.filter((p) => p.authorId === activeUserId)
  );

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!profile) return null;

  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalAvatar(url);
    setAvatarError(false);
  };

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const updated = {
      id: profile.id,
      username: formData.get("username")?.toString() ?? profile.username,
      fullName: formData.get("fullName")?.toString() ?? profile.fullName,
      bio: formData.get("bio")?.toString() ?? profile.bio,
      avatarUrl:
        localAvatar ??
        formData.get("avatarUrl")?.toString() ??
        profile.avatarUrl ??
        null,
      password: profile.password,
    };

    dispatch(updateProfile(updated));
    setIsEditing(false);
  };

  const avatarSrc: string =
    !avatarError && (localAvatar ?? profile.avatarUrl ?? undefined)
      ? (localAvatar ?? profile.avatarUrl) || DEFAULT_AVATAR
      : DEFAULT_AVATAR;

  return (
    <div
      className="page profile-page"
      style={{
        paddingLeft: 32,
        paddingRight: 24,
        paddingTop: 24,
      }}
    >
      <header
        className="profile-header"
        style={{ display: "flex", gap: 16, marginBottom: 24 }}
      >
        <img
          src={avatarSrc}
          alt={profile.username}
          className="profile-avatar"
          onClick={() => setIsAvatarOpen(true)}
          style={{
            cursor: "pointer",
            width: 72,
            height: 72,
            borderRadius: "999px",
            objectFit: "cover",
            border: "1px solid #1f2937",
          }}
          onError={() => setAvatarError(true)}
        />
        <div>
          <h2 style={{ marginBottom: 4 }}>{profile.username}</h2>
          <p style={{ marginBottom: 2 }}>{profile.fullName}</p>
          <p style={{ marginBottom: 4, fontSize: 13 }}>{profile.bio}</p>
          <p
            style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}
          >
            Публичный профиль в LMBQ
          </p>
          <button
            type="button"
            style={{
              marginTop: 8,
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, #6366f1, #ec4899)",
              color: "white",
              fontSize: 12,
              cursor: "pointer",
            }}
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? "Отменить" : "Редактировать профиль"}
          </button>
        </div>
      </header>

      {isEditing && (
        <section style={{ marginBottom: 24 }}>
          <form
            onSubmit={handleProfileSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <label style={{ fontSize: 13 }}>
              Никнейм
              <input
                name="username"
                defaultValue={profile.username ?? ""}
                placeholder="Никнейм"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Полное имя
              <input
                name="fullName"
                defaultValue={profile.fullName ?? ""}
                placeholder="Полное имя"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Ссылка на аватар
              <input
                name="avatarUrl"
                defaultValue={profile.avatarUrl ?? ""}
                placeholder="https://…"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Загрузить аватар
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              О себе
              <textarea
                name="bio"
                defaultValue={profile.bio ?? ""}
                placeholder="О себе"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 16,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                  minHeight: 60,
                  resize: "vertical",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: 4,
                padding: 8,
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #6366f1, #ec4899)",
                color: "white",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Сохранить профиль
            </button>
          </form>
        </section>
      )}

      <section className="profile-posts">
        <h3 style={{ marginBottom: 12 }}>Посты</h3>
        <div className="post-list">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {isAvatarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15,23,42,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={() => setIsAvatarOpen(false)}
        >
          <img
            src={avatarSrc}
            alt={profile.username}
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              borderRadius: "16px",
              border: "1px solid #374151",
              objectFit: "contain",
            }}
            onError={() => setAvatarError(true)}
          />
        </div>
      )}
    </div>
  );
}