import "./Tag.css";
import type { Tag as TagType } from "@/types/tag";

interface TagProps {
  tag: TagType;
  onRemove?: () => void;
}

export default function Tag({ tag, onRemove }: TagProps) {
  return (
    <span className="tag">
      {tag.name}
      {onRemove && (
        <button
          className="tag-remove"
          onClick={onRemove}
          aria-label={`Remove tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
