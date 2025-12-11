import { useState, useEffect } from "react";
import "./Posts.css";
import PostCreateForm from "@/components/posts/PostCreateForm";
import PostCard from "@/components/posts/PostCard";
import PostModal from "@/components/posts/PostModal";
import TagFilter from "@/components/tags/TagFilter";
import type { Post } from "@/types/post";
import type { Tag as TagType } from "@/types/tag";
import type { PostCreate } from "@/types/post";
import type { User } from "@/types/user";
import { api } from "@/services/api";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [authors, setAuthors] = useState<Record<number, string>>({});
  const [tags, setTags] = useState<Record<number, TagType[]>>({});
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());

  const refreshPosts = async () => {
    const loadedPosts = await api.get("/posts") as Post[];
    setPosts(loadedPosts);

    setSelectedPost((currentSelected) => {
      if (currentSelected) {
        const updatedSelectedPost = loadedPosts.find((p) => p.post_id === currentSelected.post_id);
        return updatedSelectedPost || currentSelected;
      }
      return currentSelected;
    });

    const tags = await api.get("/tags") as TagType[];
    setAllTags(tags);
    const tagsMap: Record<number, TagType[]> = {};
    for (const post of loadedPosts) {
      tagsMap[post.post_id] = tags.filter((t) => post.tag_ids.includes(t.tag_id));
    }
    setTags(tagsMap);

    const authorIds = new Set(loadedPosts.map((p) => p.author_id));
    const authorsMap: Record<number, string> = {};
    for (const authorId of authorIds) {
      try {
        const user = await api.get(`/users/${authorId}`) as User;
        authorsMap[authorId] = user.username;
      } catch (error) {
        console.error(`Failed to fetch author ${authorId}:`, error);
      }
    }
    setAuthors(authorsMap);
  };

  const handleCreatePost = async (postData: PostCreate) => {
    await api.post("/posts", postData);
    await refreshPosts();
  };

  const toggleTagFilter = (tagId: number) => {
    setSelectedTagIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const filteredPosts = (selectedTagIds.size > 0
    ? posts.filter((post) =>
        Array.from(selectedTagIds).every((tagId) => post.tag_ids.includes(tagId))
      )
    : posts
  ).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <div className="posts-page">
      <h1 className="posts-page-title">Posts</h1>
      <PostCreateForm onSubmit={handleCreatePost} />
      <TagFilter
        tags={allTags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTagFilter}
        onClear={() => setSelectedTagIds(new Set())}
      />
      <div className="posts-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.post_id}
              post={post}
              authorName={authors[post.author_id]}
              tags={tags[post.post_id]}
              onClick={() => setSelectedPost(post)}
              onUpdate={refreshPosts}
            />
          ))
        ) : (
          <p className="posts-empty">
            {selectedTagIds.size > 0
              ? "No posts match the selected tags."
              : "No posts yet. Be the first to post!"}
          </p>
        )}
      </div>
      <PostModal
        post={selectedPost}
        authorName={selectedPost ? authors[selectedPost.author_id] : undefined}
        tags={selectedPost ? tags[selectedPost.post_id] : undefined}
        onClose={() => setSelectedPost(null)}
        onPostUpdate={refreshPosts}
      />
    </div>
  );
}
