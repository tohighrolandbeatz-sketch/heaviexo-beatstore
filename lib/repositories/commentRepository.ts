import db from '@/lib/db';

export interface Comment {
  id: string;
  user_id: string;
  beat_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const commentRepository = {
  findByBeatId(beatId: string): Comment[] {
    return db.prepare('SELECT * FROM comments WHERE beat_id = ? ORDER BY created_at DESC').all() as Comment[];
  },

  create(comment: Omit<Comment, 'created_at' | 'updated_at'>): Comment {
    const now = new Date().toISOString();
    const newComment: Comment = {
      ...comment,
      created_at: now,
      updated_at: now,
    };

    db.prepare(`
      INSERT INTO comments (id, user_id, beat_id, content, created_at, updated_at)
      VALUES (@id, @user_id, @beat_id, @content, @created_at, @updated_at)
    `).run(newComment);

    return newComment;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  }
};