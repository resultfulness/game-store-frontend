import { useState } from "react";
import "./PostCreateForm.css";
import Button from "../ui/Button";
import TagInput from "../tags/TagInput";
import type { PostCreate } from "@/types/post";

interface PostCreateFormProps {
  onSubmit: (post: PostCreate) => Promise<void>;
}

export default function PostCreateForm({ onSubmit }: PostCreateFormProps) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), tag_names: tags });
      setContent("");
      setTags([]);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="post-create-form" onSubmit={handleSubmit}>
      <textarea
        className="post-create-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
      />
      <TagInput tags={tags} onTagsChange={setTags} />
      <Button type="submit" className="post-create-submit">
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
