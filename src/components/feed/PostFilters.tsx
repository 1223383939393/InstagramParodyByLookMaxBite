// src/components/feed/PostFilters.tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { setSearch, setTagFilter, setSortBy } from "../../store/postsSlice";

export default function PostFilters() {
  const dispatch = useDispatch();
  const { search, tagFilter, sortBy } = useSelector(
    (state: RootState) => state.posts
  );

  return (
    <div className="post-filters">
      <input
        placeholder="Поиск по подписям и тегам"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />

      <select
        value={tagFilter}
        onChange={(e) => dispatch(setTagFilter(e.target.value))}
      >
        <option value="all">Все теги</option>
        <option value="f1">F1</option>
        <option value="racing">racing</option>
        <option value="night">night</option>
        <option value="morning">morning</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) =>
          dispatch(setSortBy(e.target.value as "newest" | "likes"))
        }
      >
        <option value="newest">Сначала новые</option>
        <option value="likes">По лайкам</option>
      </select>
    </div>
  );
}