import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();


export const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
export const SPT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
