import fs from "fs";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { DatabaseConnection } from "../indexing/refreshIndex.js";
import { getPromptDataSqlitePath } from "./paths.js";
import { PromptPublish } from "../index";

export class PromptSqliteDb {
  static db: DatabaseConnection | null = null;

  private static async createTables(db: DatabaseConnection) {
    await db.exec(
      `CREATE TABLE IF NOT EXISTS prompt_profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile TEXT NOT NULL,
            prompt TEXT NOT NULL,
            content TEXT NOT NULL,
            description TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
    );
  }

  public static async updatePrompt(prompt: PromptPublish) {
    const db = await PromptSqliteDb.get();
    await db?.run(
      "UPDATE prompt_profile  SET content = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE profile = ? AND prompt = ?",
      [prompt.content, prompt.description , prompt.profileId, prompt.name],
    );
  }

  public static async insertPrompt( prompt: PromptPublish) {
    const db = await PromptSqliteDb.get();
    const createdAt = prompt.createdAt ? prompt.createdAt : new Date();
    const updatedAt = prompt.updatedAt ? prompt.updatedAt : new Date();
    await db?.run(
      "INSERT INTO prompt_profile (profile, prompt, content, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [prompt.profileId, prompt.name, prompt.content, prompt.description, createdAt, updatedAt],
    );
  }


  public static async updateOrInsertPrompt(prompt: PromptPublish) {
    const db = await PromptSqliteDb.get();
    const existingPrompt = await db?.get(
      "SELECT 1 FROM prompt_profile WHERE profile = ? AND prompt = ?",
      [prompt.profileId, prompt.name],
    );

    if (existingPrompt) {
      await db?.run(
        "UPDATE prompt_profile SET content = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE profile = ? AND prompt = ?",
        [prompt.content, prompt.description, prompt.profileId, prompt.name],
      );
    } else {
      await db?.run(
        "INSERT INTO prompt_profile (profile, prompt, content, description) VALUES (?, ?, ?, ?)",
        [prompt.profileId, prompt.name, prompt.content, prompt.description],
      );
    }
  }

  public static async getPromptsByProfile(profile: string): Promise<PromptPublish[]> {
    const db = await PromptSqliteDb.get();
    const result = await db?.all(
      `SELECT date(updated_at) as updatedAt, date(created_at) as createdAt, prompt as name, content, description, profile as profileId,
        FROM prompt_profile WHERE profile = ?`, [profile]
    );
    return result ?? [];
  }

  static async get() {
    const promptDataSqlitePath = getPromptDataSqlitePath();
    if (PromptSqliteDb.db && fs.existsSync(promptDataSqlitePath)) {
      return PromptSqliteDb.db;
    }

    PromptSqliteDb.db = await open({
      filename: promptDataSqlitePath,
      driver: sqlite3.Database,
    });

    await PromptSqliteDb.db.exec("PRAGMA busy_timeout = 3000;");

    await PromptSqliteDb.createTables(PromptSqliteDb.db!);

    return PromptSqliteDb.db;
  }
}
