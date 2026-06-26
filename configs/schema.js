
import {
  boolean,
  serial,
  varchar,
  json,
  integer,
  text,
  uuid
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull(),
  isMember: boolean().default(false),
  plan: varchar().default("Basic"),
});

export const Study_Material_Table = pgTable("studyMaterial", {
  id: uuid("id").primaryKey(), // UUID comes from frontend
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  status: varchar().default("Generating"),
});

export const Chapter_Notes_Table = pgTable("chapterNotes", {
  id: serial().primaryKey(),
  courseId: uuid("courseId")
    .references(() => Study_Material_Table.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  chapterId: integer().notNull(),
  notes: text(),
});

export const Study_Type_Content_Table = pgTable("studyTypeContent", {
  id: serial().primaryKey(),
  courseId: uuid("courseId")
    .references(() => Study_Material_Table.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  content: json(),
  type: varchar().notNull(),
  status: varchar().default("Generating"),
});