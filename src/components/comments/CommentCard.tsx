import "./CommentCard.css";
import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";
import type { Comment } from "@/types/comment";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/auth";
import { formatDate } from "@/utils/utils";

interface CommentCardProps {
  comment: Comment;
  authorName?: string;
  onUpdate?: () => void;
}

export default function CommentCard({ comment, authorName, onUpdate }: CommentCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAuthor = user?.user_id === comment.author_id;

  useEffect(() => {
    const checkLiked = async () => {
      try {
        const isLiked = await api.get(`/comments/${comment.comment_id}/like_status`) as boolean;
        setLiked(isLiked);
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };
    checkLiked();
  }, [comment.comment_id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.post(`/comments/${comment.comment_id}/unlike`, {});
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await api.post(`/comments/${comment.comment_id}/like`, {});
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/comments/${comment.comment_id}`);
      if (onUpdate) onUpdate();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-card-header">
        <span className="comment-card-author">{authorName || `User ${comment.author_id}`}</span>
        <div className="comment-card-header-right">
          <span className="comment-card-date">{formatDate(comment.created_at)}</span>
          {isAuthor && (
            <button
              className="comment-card-delete"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete comment"
              title="Delete comment"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <p className="comment-card-content">{comment.content}</p>
      <div className="comment-card-footer">
        <div className="comment-card-stats">
          <span className="comment-card-stat">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
        <Button
          onClick={handleLike}
          className={`comment-card-like ${liked ? "comment-card-like-active" : ""}`}
        >
          {liked ? "♥" : "♡"} Like
        </Button>
      </div>
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  );
}
