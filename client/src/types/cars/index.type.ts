export type Car = {
    _id: string;
    title: string;
    description: string;
    images: string [];
    tags: string [];
    user?: {
        name: string,
        email: string
    }
}