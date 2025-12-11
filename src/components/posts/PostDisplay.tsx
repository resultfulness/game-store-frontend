import "./PostDisplay.css";
import Button from "../ui/Button";
import Tag from "../tags/Tag";
import type { Post } from "@/types/post";
import type { Tag as TagType } from "@/types/tag";
import { formatDate } from "@/utils/utils";

interface PostDisplayProps {
  post: Post;
  authorName?: string;
  tags?: TagType[];
  commentCount?: number;
  likeCount: number;
  liked: boolean;
  onLike: () => void;
}

export default function PostDisplay({
  post,
  authorName,
  tags,
  commentCount,
  likeCount,
  liked,
  onLike,
}: PostDisplayProps) {
  return (
    <div className="post-display">
      <div className="post-display-header">
        <div className="post-display-author">
          <span className="post-display-author-name">
            {authorName || `User ${post.author_id}`}
          </span>
          <span className="post-display-date">{formatDate(post.created_at)}</span>
        </div>
        {tags && tags.length > 0 && (
          <div className="post-display-tags">
            {tags.map((tag) => (
              <Tag key={tag.tag_id} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <p className="post-display-content">{post.content}</p>
      <div className="post-display-footer">
        <div className="post-display-stats">
          <span className="post-display-stat">
            {commentCount ?? post.comment_ids?.length ?? 0}{" "}
            {(commentCount ?? post.comment_ids?.length ?? 0) === 1 ? "comment" : "comments"}
          </span>
          <span className="post-display-stat">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
        <Button
          onClick={onLike}
          className={`post-display-like ${liked ? "post-display-like-active" : ""}`}
        >
          {liked ? "♥" : "♡"} Like
        </Button>
      </div>
    </div>
  );
}
