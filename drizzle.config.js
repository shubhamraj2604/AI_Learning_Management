import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
dbCredentials:{
    url:'postgresql://neondb_owner:npg_0v7utSzlWHmb@ep-summer-cell-ah64gobm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
}
});
