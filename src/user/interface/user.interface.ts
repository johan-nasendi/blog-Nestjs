import { PostInterface } from "src/blogs/posts/interface/post-entry.interface";

export interface UserInterface {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
    PostEntries?: PostInterface[];
}

export interface VerficationsInterface {
    id?: number;
    code?: string;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',    
    EDITOR = 'editor',
    USER = 'user'
}