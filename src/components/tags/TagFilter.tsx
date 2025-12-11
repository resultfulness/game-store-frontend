import "./TagFilter.css";
import Tag from "./Tag";
import type { Tag as TagType } from "@/types/tag";

interface TagFilterProps {
  tags: TagType[];
  selectedTagIds: Set<number>;
  onToggleTag: (tagId: number) => void;
  onClear: () => void;
}

export default function TagFilter({
  tags,
  selectedTagIds,
  onToggleTag,
  onClear,
}: TagFilterProps) {
  return (
    <div className="tag-filter">
      <h3 className="tag-filter-title">Filter by tags:</h3>
      <div className="tag-filter-tags">
        {tags.map((tag) => (
          <button
            key={tag.tag_id}
            className={`tag-filter-tag ${selectedTagIds.has(tag.tag_id) ? "tag-filter-tag-active" : ""}`}
            onClick={() => onToggleTag(tag.tag_id)}
          >
            <Tag tag={tag} />
          </button>
        ))}
      </div>
      {selectedTagIds.size > 0 && (
        <button className="tag-filter-clear" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
