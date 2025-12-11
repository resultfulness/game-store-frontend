export type Comment = {
    comment_id: number;
    author_id: number;
    content: string;
    created_at: string;
    like_count: number;
}

export type CommentCreate = {
    content: string;
    post_id: number;
}