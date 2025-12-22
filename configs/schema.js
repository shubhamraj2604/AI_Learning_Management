
import { boolean, serial, varchar  , json , integer , text} from 'drizzle-orm/pg-core';
import { pgTable } from "drizzle-orm/pg-core";

export const USER_TABLE=pgTable('users',{
    id:serial().primaryKey(),
    userName:varchar().notNull(),
    email:varchar().notNull(),
    isMember:boolean().default(false)
})

export const Study_Material_Table = pgTable('studyMaterial', {
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    courseType:varchar().notNull(),
    topic:varchar().notNull(),
    difficultyLevel:varchar().default('Easy'),
    courseLayout:json(),
    createdBy:varchar().notNull(),
    status:varchar().default('Generating')
})

export const Chapter_Notes_Table = pgTable('chapterNotes' , {
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    chapterId:integer("chapterId").notNull(),
    notes:text()
})