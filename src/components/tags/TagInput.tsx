import { useState } from "react";
import type { KeyboardEvent } from "react";
import "./TagInput.css";
import Button from "../ui/Button";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const limitedValue = trimmedValue.substring(0, 20);
      onTagsChange([...tags, limitedValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input">
      <div className="tag-input-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-input-tag">
            {tag}
            <button
              className="tag-input-tag-remove"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="tag-input-controls">
        <input
          type="text"
          className="tag-input-field"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 20) {
              setInputValue(value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          maxLength={20}
        />
        <Button type="button" onClick={handleAddTag} className="tag-input-add">
          +
        </Button>
      </div>
    </div>
  );
}
