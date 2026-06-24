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

export type PostsState = {
  items: Post[];
};

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Полная замена списка постов с сервера (используется в FeedPage)
    setPostsFromServer(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
    },

    // Добавить один пост, который пришёл с сервера после создания (используется в NewPostPage)
    addPostFromServer(state, action: PayloadAction<Post>) {
      state.items.unshift(action.payload);
    },

    // Обновить пост, пришедший с сервера (например, после лайка/редактирования)
    updatePostFromServer(state, action: PayloadAction<Post>) {
      const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
      }
    },

    // Добавить комментарий к посту
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

    // Удалить пост по id
    removePost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      state.items = state.items.filter((p) => p.id !== postId);
    },
  },
});

export const {
  setPostsFromServer,
  addPostFromServer,
  updatePostFromServer,
  addCommentToPost,
  removePost,
} = postsSlice.actions;

export default postsSlice.reducer;