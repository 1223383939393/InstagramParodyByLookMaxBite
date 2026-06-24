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

const initialState: PostsState = {
  items: [],
  search: "",
  tagFilter: null,
  sortBy: "new",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // посты с сервера (лента)
    setPostsFromServer(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
    },

    // добавление одного поста (созданного на сервере)
    addPostFromServer(state, action: PayloadAction<Post>) {
      state.items.unshift(action.payload);
    },

    // обновление поста (например, лайки/редактирование)
    updatePostFromServer(state, action: PayloadAction<Post>) {
      const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
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
      }
    },

    removePost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      state.items = state.items.filter((p) => p.id !== postId);
    },

    // --- фильтры и сортировка для PostFilters / PostList ---
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setTagFilter(state, action: PayloadAction<string | null>) {
      state.tagFilter = action.payload;
    },

    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
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
} = postsSlice.actions;

export default postsSlice.reducer;