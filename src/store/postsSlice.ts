// src/store/postsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
};

export type Post = {
  id: string;
  authorId: string;
  caption: string;
  imageUrl: string | null;
  tags: string[];
  likes: number;
  likedByUserIds: string[];
  createdAt: string;
  comments: Comment[];
};

export type SortBy = "new" | "top";

export type PostsState = {
  items: Post[];
  search: string;
  tagFilter: string | null;
  sortBy: SortBy;
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
    // ignore errors
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
    setPostsFromServer(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
      savePosts(state);
    },

    addPostFromServer(state, action: PayloadAction<Post>) {
      state.items.unshift(action.payload);
      savePosts(state);
    },

    updatePostFromServer(state, action: PayloadAction<Post>) {
      const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
        savePosts(state);
      }
    },

    addCommentToPost(
      state,
      action: PayloadAction<{ postId: string; comment: Comment }>
    ) {
      const { postId, comment } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post) {
        post.comments.push(comment);
        savePosts(state);
      }
    },

    removePost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      state.items = state.items.filter((p) => p.id !== postId);
      savePosts(state);
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      savePosts(state);
    },

    setTagFilter(state, action: PayloadAction<string | null>) {
      state.tagFilter = action.payload;
      savePosts(state);
    },

    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
      savePosts(state);
    },

    toggleLike(
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
  },
});

export const {
  setPostsFromServer,
  addPostFromServer,
  updatePostFromServer,
  addCommentToPost,
  removePost,
  setSearch,
  setTagFilter,
  setSortBy,
  toggleLike,
} = postsSlice.actions;

export default postsSlice.reducer;