import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export type Post = {
  id: string;
  authorId: string;
  caption: string;
  imageUrl?: string;           // картинка теперь опциональна
  tags: string[];
  likes: number;
  likedByUserIds: string[];
  createdAt: string;
};

export type PostsState = {
  items: Post[];
  search: string;
  tagFilter: string | null;
  sortBy: "new" | "top";
};

const POSTS_STORAGE_KEY = "lmbq_posts";

function loadPosts(): PostsState | null {
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PostsState;
  } catch {
    return null;
  }
}

function savePosts(state: PostsState) {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // игнорируем ошибки
  }
}

const defaultState: PostsState = {
  items: [],
  search: "",
  tagFilter: null,
  sortBy: "new",
};

const initialState: PostsState = loadPosts() ?? defaultState;

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(
      state,
      action: PayloadAction<{
        id: string;
        authorId: string;
        caption: string;
        imageUrl?: string;
        tags: string[];
      }>
    ) {
      const now = new Date().toISOString();
      const newPost: Post = {
        id: action.payload.id,
        authorId: action.payload.authorId,
        caption: action.payload.caption,
        imageUrl: action.payload.imageUrl,
        tags: action.payload.tags,
        likes: 0,
        likedByUserIds: [],
        createdAt: now,
      };

      state.items.unshift(newPost);
      savePosts(state);
    },
    likePost(
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) {
      const { postId, userId } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (!post) return;

      const alreadyLiked = post.likedByUserIds.includes(userId);
      if (alreadyLiked) {
        post.likedByUserIds = post.likedByUserIds.filter(
          (id) => id !== userId
        );
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.likedByUserIds.push(userId);
        post.likes += 1;
      }

      savePosts(state);
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTagFilter(state, action: PayloadAction<string | null>) {
      state.tagFilter = action.payload;
    },
    setSortBy(state, action: PayloadAction<"new" | "top">) {
      state.sortBy = action.payload;
    },
  },
});

export const { addPost, likePost, setSearch, setTagFilter, setSortBy } =
  postsSlice.actions;
export default postsSlice.reducer;

export const selectPosts = (state: RootState) => state.posts.items;