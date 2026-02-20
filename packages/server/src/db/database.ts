import { DatabaseSync } from 'node:sqlite';
import { User, RedditMeme } from './dbModels';

export class AppDatabase {
  private readonly db: DatabaseSync;

  constructor(dbPath = 'whatdoumeme.db') {
    this.db = new DatabaseSync(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reddit_posts (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url  TEXT NOT NULL,
        sub  TEXT NOT NULL
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

  public close(): void {
    this.db.close();
  }
}
