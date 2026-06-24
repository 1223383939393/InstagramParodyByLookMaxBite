const POSTS_KEY = "pixly_posts";
const USERS_KEY = "pixly_users";

export const loadPosts = <T,>(fallback: T): T => {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const savePosts = <T,>(data: T) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(data));
};

export const loadUsers = <T,>(fallback: T): T => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveUsers = <T,>(data: T) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(data));
};