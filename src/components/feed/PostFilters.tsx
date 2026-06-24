import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  setSearch,
  setTagFilter,
  setSortBy,
} from "../../store/postsSlice";

export default function PostFilters() {
  const dispatch = useDispatch();
  const postsState = useSelector((state: RootState) => state.posts);
  const { search, tagFilter, sortBy } = postsState;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Поиск по тексту и тегам"
        style={{
          flex: 1,
          minWidth: 160,
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: 13,
        }}
      />

      <select
        value={tagFilter ?? ""} // null → ""
        onChange={(e) =>
          dispatch(
            setTagFilter(e.target.value || null)
          )
        }
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: 13,
        }}
      >
        <option value="">Все теги</option>
        <option value="music">#music</option>
        <option value="travel">#travel</option>
        <option value="sport">#sport</option>
        {/* при желании добавь реальные теги */}
      </select>

      <select
        value={sortBy}
        onChange={(e) =>
          dispatch(
            setSortBy(
              e.target.value === "top" ? "top" : "new"
            )
          )
        }
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: 13,
        }}
      >
        <option value="new">Сначала новые</option>
        <option value="top">По лайкам</option>
      </select>
    </div>
  );
}