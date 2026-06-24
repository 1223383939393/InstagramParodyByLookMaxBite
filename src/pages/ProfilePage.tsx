// src/pages/ProfilePage.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import PostCard from "../components/feed/PostCard";
import { updateProfile } from "../store/usersSlice";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.users);

  const profile = usersState.items.find(
    (u) => u.id === usersState.currentUserId
  );

  const posts = useSelector((state: RootState) =>
    state.posts.items.filter((p) => p.authorId === usersState.currentUserId)
  );

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  if (!profile) return null;

  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalAvatar(url);
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
        profile.avatarUrl,
    };

    dispatch(updateProfile(updated));
  };

  return (
    <div className="page profile-page">
      <header className="profile-header">
        <img
          src={localAvatar ?? profile.avatarUrl}
          alt={profile.username}
          className="profile-avatar"
        />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.fullName}</p>
          <p>{profile.bio}</p>
        </div>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h3>Редактировать профиль</h3>
        <form
          onSubmit={handleProfileSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            name="username"
            defaultValue={profile.username}
            placeholder="Никнейм"
          />
          <input
            name="fullName"
            defaultValue={profile.fullName}
            placeholder="Полное имя"
          />
          <input
            name="avatarUrl"
            defaultValue={profile.avatarUrl}
            placeholder="Ссылка на аватар (можно пусто)"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
          />
          <textarea
            name="bio"
            defaultValue={profile.bio}
            placeholder="О себе"
          />
          <button type="submit">Сохранить профиль</button>
        </form>
      </section>

      <section className="profile-posts">
        <h3>Посты</h3>
        <div className="post-list">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}   