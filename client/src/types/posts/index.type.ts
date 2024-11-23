export type Post = {
    _id: string;
    authorName: string;
    bio: string;
    createdAt: Date;
    image: string;
    isLiked: boolean;
    likes: number
    title: string;
    updatedAt: Date;
    userId: string;
}