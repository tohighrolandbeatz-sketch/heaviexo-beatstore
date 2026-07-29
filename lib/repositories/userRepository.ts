import { db } from '@/lib/db';
import { users } from '@/app/config/schema';
import { eq, desc } from 'drizzle-orm';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  async findAll(): Promise<User[]> {
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return result.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!result[0]) return null;
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!result[0]) return null;
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  },

  async create(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const now = new Date();
    const newUser: User = {
      ...user,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: now,
      updatedAt: now,
    });

    return newUser;
  },

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
};