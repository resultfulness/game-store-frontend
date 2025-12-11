import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./PostModal.css";
import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";
import PostDisplay from "./PostDisplay";
import CommentCard from "../comments/CommentCard";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { Post } from "@/types/post";
import type { Comment, CommentCreate } from "@/types/comment";
import type { Tag as TagType } from "@/types/tag";
import type { User } from "@/types/user";
import { api } from "@/services/api";
import { useAuth } from "@/auth";

interface PostModalProps {
  post: Post | null;
  authorName?: string;
  tags?: TagType[];
  onClose: () => void;
  onPostUpdate?: () => void;
}

export default function PostModal({
  post,
  authorName,
  tags,
  onClose,
  onPostUpdate,
}: PostModalProps) {
  const { user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<Record<number, string>>({});
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAuthor = user?.user_id === post?.author_id;

  useEffect(() => {
    if (!post) {
      setShowDeleteConfirm(false);
      return;
    }

    const loadData = async () => {
      try {
        const postComments = await api.get(`/comments/post/${post.post_id}`) as Comment[];
        setComments(postComments);
        setCommentCount(postComments.length);

        const authorIds = new Set([
          post.author_id,
          ...postComments.map((c) => c.author_id),
        ]);
        const authorsMap: Record<number, string> = {};
        for (const authorId of authorIds) {
          try {
            const user = await api.get(`/users/${authorId}`) as User;
            authorsMap[authorId] = user.username;
          } catch (error) {
            console.error(`Failed to fetch author ${authorId}:`, error);
          }
        }
        setCommentAuthors(authorsMap);

        const isLiked = await api.get(`/posts/${post.post_id}/like_status`) as boolean;
        setLiked(isLiked);
        setLikeCount(post.like_count || 0);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Failed to load post data:", error);
      }
    };

    loadData();
  }, [post]);

  useScrollLock(!!post);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showDeleteConfirm) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('.confirm-modal-overlay') && !showDeleteConfirm) {
          onClose();
        }
      }
    };

    if (post) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [post, onClose, showDeleteConfirm]);

  const handleCreateComment = async (commentData: CommentCreate) => {
    try {
      await api.post(`/posts/comments`, commentData);
      const postComments = await api.get(`/comments/post/${post!.post_id}`) as Comment[];
      setComments(postComments);
      setCommentCount(postComments.length);

      const authorIds = new Set(postComments.map((c) => c.author_id));
      const authorsMap: Record<number, string> = { ...commentAuthors };
      for (const authorId of authorIds) {
        if (!authorsMap[authorId]) {
          try {
            const user = await api.get(`/users/${authorId}`) as User;
            authorsMap[authorId] = user.username;
          } catch (error) {
            console.error(`Failed to fetch author ${authorId}:`, error);
          }
        }
      }
      setCommentAuthors(authorsMap);
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleLikePost = async () => {
    try {
      if (liked) {
        await api.post(`/posts/${post!.post_id}/unlike`, {});
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await api.post(`/posts/${post!.post_id}/like`, {});
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post!.post_id}`);
      if (onPostUpdate) onPostUpdate();
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCommentUpdate = () => {
    if (!post) return;
    api.get(`/comments/post/${post.post_id}`).then((postComments: Comment[]) => {
      setComments(postComments);
      setCommentCount(postComments.length);
      if (onPostUpdate) onPostUpdate();
    });
  };

  if (!post) return null;

  return createPortal(
    <div className="post-modal-overlay">
      <div className="post-modal" ref={modalRef}>
        <div className="post-modal-header">
          <h2 className="post-modal-title">Post</h2>
          <div className="post-modal-header-actions">
            {isAuthor && (
              <Button onClick={() => setShowDeleteConfirm(true)} className="post-modal-delete">
                Delete
              </Button>
            )}
            <Button onClick={onClose} className="post-modal-close">
              ×
            </Button>
          </div>
        </div>
        <div className="post-modal-content">
          <PostDisplay
            post={post}
            authorName={authorName}
            tags={tags}
            commentCount={commentCount}
            likeCount={likeCount}
            liked={liked}
            onLike={handleLikePost}
          />
          <div className="post-modal-comments">
            <h3 className="post-modal-comments-title">Comments</h3>
            {post && (
              <CommentCreateForm
                onSubmit={handleCreateComment}
                post_id={post.post_id}
              />
            )}
            <div className="post-modal-comments-list">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.comment_id}
                    comment={comment}
                    authorName={commentAuthors[comment.author_id]}
                    onUpdate={handleCommentUpdate}
                  />
                ))
              ) : (
                <p className="post-modal-comments-empty">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>,
    document.body
  );
}
