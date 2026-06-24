import NewPostForm from "../components/feed/NewPostForm";
import PostFilters from "../components/feed/PostFilters";
import PostList from "../components/feed/PostList";

export default function FeedPage() {
  return (
    <div className="page feed-page">
      <h1>Pixly — лента</h1>
      <NewPostForm />
      <PostFilters />
      <PostList />
    </div>
  );
}