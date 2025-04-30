import { User } from "@/types/user";

export type Video = {
    user : User;
    code : string;
    title : string;
    authorName : string;
    url : string;
    height : number;
    width : number;
    thumbnailUrl : string;
    thumbnailWidth : number;
    thumbnailHeight : number;
    createdAt : string;
    description : string;
    priority : number;
}