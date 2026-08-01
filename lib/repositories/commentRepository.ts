import { db } from '@/lib/db';
import { comments } from '@/app/config/schema';
import { eq, desc } from 'drizzle-orm';

export interface Comment {
  id: string;
  user_id: string;
  beat_id: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export const commentRepository = {
  async findByBeatId(beatId: string): Promise<Comment[]> {
    const result = await db.select().from(comments).where(eq(comments.beatId, beatId)).orderBy(desc(comments.createdAt));
    return result.map((row) => ({
      id: row.id,
      user_id: row.userId,
      beat_id: row.beatId,
      content: row.content,
      rating: row.rating || 0,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    }));
  },

  async create(comment: Omit<Comment, 'created_at' | 'updated_at'>): Promise<Comment> {
    const now = new Date();
    const newComment: Comment = {
      ...comment,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    await db.insert(comments).values({
      id: comment.id,
      userId: comment.user_id,
      beatId: comment.beat_id,
      content: comment.content,
      rating: comment.rating || 0,
      createdAt: now,
      updatedAt: now,
    });

    return newComment;
  },

  async delete(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }
};
