import { useState } from "react";
import "./CommentCreateForm.css";
import Button from "../ui/Button";
import type { CommentCreate } from "@/types/comment";

interface CommentCreateFormProps {
  onSubmit: (comment: CommentCreate) => Promise<void>;
  post_id: number;
}

export default function CommentCreateForm({ onSubmit, post_id }: CommentCreateFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), post_id: post_id });
      setContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comment-create-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-create-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
      />
      <Button type="submit" className="comment-create-submit">
        {isSubmitting ? "Posting..." : "Comment"}
      </Button>
    </form>
  );
}
