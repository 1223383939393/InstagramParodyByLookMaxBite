// src/store/postsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loadPosts, savePosts } from "../utils/storage";

export type Post = {
  id: string;
  authorId: string;
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  likedByUserIds?: string[];
  createdAt: string;
};

type PostsState = {
  items: Post[];
  search: string;
  tagFilter: string;
  sortBy: "newest" | "likes";
};

const demoPosts: Post[] = [
  {
    id: "1",
    authorId: "user1",
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    caption: "Утренний пит-стоп",
    tags: ["f1", "morning"],
    likes: 128,
    likedByUserIds: ["user2"],
    createdAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "2",
    authorId: "user2",
    imageUrl:
      "https://images.unsplash.com/photo-1518176258769-f227c79839a2?auto=format&fit=crop&w=800&q=80",
    caption: "Ночная гонка",
    tags: ["night", "racing"],
    likes: 256,
    likedByUserIds: ["user1"],
    createdAt: "2026-06-21T22:30:00Z",
  },
];

const initialState: PostsState = {
  items: loadPosts<Post[]>(demoPosts),
  search: "",
  tagFilter: "all",
  sortBy: "newest",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<Post>) {
      state.items.unshift({
        ...action.payload,
        likedByUserIds: [],
      });
      savePosts(state.items);
    },
    likePost(
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) {
      const post = state.items.find((p) => p.id === action.payload.postId);
      if (!post) return;

      const likedSet = new Set(post.likedByUserIds ?? []);
      if (likedSet.has(action.payload.userId)) {
        return;
      }

      likedSet.add(action.payload.userId);
      post.likedByUserIds = Array.from(likedSet);
      post.likes += 1;
      savePosts(state.items);
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTagFilter(state, action: PayloadAction<string>) {
      state.tagFilter = action.payload;
    },
    setSortBy(state, action: PayloadAction<PostsState["sortBy"]>) {
      state.sortBy = action.payload;
    },
  },
});

export const { addPost, likePost, setSearch, setTagFilter, setSortBy } =
  postsSlice.actions;

export default postsSlice.reducer;