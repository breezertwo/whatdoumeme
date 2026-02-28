import { DatabaseSync } from 'node:sqlite';
import { User, RedditMeme } from './dbModels';
import { GameSnapshot } from '../interfaces/game';

export class AppDatabase {
  private readonly db: DatabaseSync;

  constructor(dbPath = 'whatdoumeme.db') {
    this.db = new DatabaseSync(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reddit_posts (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url   TEXT NOT NULL,
        sub   TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS rooms (
        id       TEXT PRIMARY KEY,
        snapshot TEXT NOT NULL
      );
    `);
    console.log('[DB] SQLite database initialised');
  }

  public getOrCreateUser(username: string): User {
    const find = this.db.prepare('SELECT id, username FROM users WHERE username = ?');
    let user = find.get(username) as unknown as User | undefined;
    if (!user) {
      this.db.prepare('INSERT INTO users (username) VALUES (?)').run(username);
      user = find.get(username) as unknown as User;
    }
    return user;
  }

  public getRandomRedditMeme(): string | undefined {
    const row = this.db
      .prepare('SELECT url FROM reddit_posts ORDER BY RANDOM() LIMIT 1')
      .get() as unknown as Pick<RedditMeme, 'url'> | undefined;
    return row?.url;
  }

  // ── Room persistence ─────────────────────────────────────────────────────────

  public saveRoom(snapshot: GameSnapshot): void {
    this.db.prepare(`
      INSERT INTO rooms (id, snapshot) VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET snapshot = excluded.snapshot
    `).run(snapshot.id, JSON.stringify(snapshot));
  }

  public loadAllRooms(): GameSnapshot[] {
    const rows = this.db
      .prepare('SELECT snapshot FROM rooms')
      .all() as { snapshot: string }[];
    return rows.map((r) => JSON.parse(r.snapshot) as GameSnapshot);
  }

  public deleteRoom(roomId: string): void {
    this.db.prepare('DELETE FROM rooms WHERE id = ?').run(roomId);
  }

  public close(): void {
    this.db.close();
  }
}
