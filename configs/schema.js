
import {
  boolean,
  serial,
  varchar,
  json,
  integer,
  text,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar().notNull(),
  email: varchar().notNull(),
  isMember: boolean().default(false),
  plan: varchar().default("Basic"),
  creditsUsed: integer("creditsUsed").default(0).notNull(),
  creditsResetAt: timestamp("creditsResetAt", { withTimezone: true }).defaultNow().notNull(),
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

export const Learning_Spark_Table = pgTable("learningSpark", {
  id: serial().primaryKey(),
  courseId: uuid("courseId")
    .references(() => Study_Material_Table.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  chapterNumber: integer().notNull(),
  type: varchar().notNull(),
  title: varchar().notNull(),
  content: text().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const User_Learning_Spark_Table = pgTable("userLearningSpark", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),
  nuggetId: integer("nuggetId")
    .references(() => Learning_Spark_Table.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  isFavorite: boolean().default(false),
  seenAt: timestamp("seenAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});