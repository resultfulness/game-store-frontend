export type Post = {
    post_id: number;
    author_id: number;
    content: string;
    created_at: string;
    like_count: number;
    comment_ids: number[];
    tag_ids: number[];
}

export type PostCreate = {
    content: string;
    tag_names: string[];
}