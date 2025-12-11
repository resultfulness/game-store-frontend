import { useState, useEffect } from "react";
import "./PostCard.css";
import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";
import Tag from "../tags/Tag";
import type { Post } from "@/types/post";
import type { Tag as TagType } from "@/types/tag";
import { api } from "@/services/api";
import { useAuth } from "@/auth";
import { formatDate } from "@/utils/utils";

interface PostCardProps {
  post: Post;
  authorName?: string;
  tags?: TagType[];
  onClick: () => void;
  onUpdate?: () => void;
}

export default function PostCard({ post, authorName, tags, onClick, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAuthor = user?.user_id === post.author_id;

  useEffect(() => {
    setLikeCount(post.like_count || 0);
    const checkLiked = async () => {
      try {
        const isLiked = await api.get(`/posts/${post.post_id}/like_status`) as boolean;
        setLiked(isLiked);
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };
    checkLiked();
  }, [post.post_id, post.like_count]);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.post(`/posts/${post.post_id}/unlike`, {});
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await api.post(`/posts/${post.post_id}/like`, {});
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.post_id}`);
      if (onUpdate) onUpdate();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  return (
    <div className="card post-card">
      <div className="post-card-header" onClick={onClick}>
        <div className="post-card-author">
          <span className="post-card-author-name">{authorName || `User ${post.author_id}`}</span>
          <span className="post-card-date">{formatDate(post.created_at)}</span>
        </div>
        <div className="post-card-header-right">
          {tags && tags.length > 0 && (
            <div className="post-card-tags">
              {tags.map((tag) => (
                <Tag key={tag.tag_id} tag={tag} />
              ))}
            </div>
          )}
          {isAuthor && (
            <button
              className="post-card-delete"
              onClick={handleDeleteClick}
              aria-label="Delete post"
              title="Delete post"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <p className="post-card-content" onClick={onClick}>{post.content}</p>
      <div className="post-card-footer">
        <div className="post-card-stats" onClick={onClick}>
          <span className="post-card-stat">
            {post.comment_ids?.length || 0} {post.comment_ids?.length === 1 ? "comment" : "comments"}
          </span>
          <span className="post-card-stat">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
        <Button
          onClick={(e) => {
            e?.stopPropagation();
            handleLike();
          }}
          className={`post-card-like ${liked ? "post-card-like-active" : ""}`}
        >
          {liked ? "♥" : "♡"} Like
        </Button>
      </div>
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  );
}
