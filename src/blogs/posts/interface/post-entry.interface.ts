
import { CategoryInterface } from "src/blogs/categories/interface/category.interface";
import { TagsInterface } from "src/blogs/tags/interface/tag.interface";
import { UserInterface } from "src/user/interface/user.interface";


export interface PostInterface {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    likes?: number;
    author?: UserInterface;
    category?:CategoryInterface;
    tags?: TagsInterface[];
    image?: string;
    video?: string;
    publishedDate?: Date;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}