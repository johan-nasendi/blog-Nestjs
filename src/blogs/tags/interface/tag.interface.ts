import { PostInterface } from "src/blogs/posts/interface/post-entry.interface";

export interface TagsInterface {
    id?: number;
    tag?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    posts?: PostInterface[];
   
}