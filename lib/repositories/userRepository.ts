import db from '@/lib/db';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  findAll(): User[] {
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  },

  findById(id: string): User | null {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User;
    return row || null;
  },

  findByEmail(email: string): User | null {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;
    return row || null;
  },

  create(user: Omit<User, 'created_at' | 'updated_at'>): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      created_at: now,
      updated_at: now,
    };

    db.prepare(`
      INSERT INTO users (id, name, email, role, created_at, updated_at)
      VALUES (@id, @name, @email, @role, @created_at, @updated_at)
    `).run(newUser);

    return newUser;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }
};