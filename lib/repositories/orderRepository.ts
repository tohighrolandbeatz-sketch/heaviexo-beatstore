import db from "@/lib/db";

export interface Order {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  paymentReference?: string;
  currency?: string;
  items?: string; // JSON stringifié des articles achetés
  totalAmount?: number;
  downloadLinks?: string;
  status?: string; // ex: 'pending', 'paid', 'failed'
  createdAt?: string;
  paidAt?: string;
}

export class OrderRepository {
  // ==========================================
  // LECTURE
  // ==========================================

  static async getAll(): Order[] {
    return await db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as Order[];
  }

  static async getById(id: string): Order | undefined {
    return await db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  }

  static getByEmail(email: string): Order[] {
    return await db.prepare("SELECT * FROM orders WHERE customerEmail = ? ORDER BY createdAt DESC").all(email) as Order[];
  }

  static getByStatus(status: string): Order[] {
    return await db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY createdAt DESC").all(status) as Order[];
  }

  // ==========================================
  // CRÉATION
  // ==========================================

  static async create(order: Order): boolean {
    const stmt = await db.prepare(`
      INSERT INTO orders (
        id,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        paymentReference,
        currency,
        items,
        totalAmount,
        downloadLinks,
        status
      )
      VALUES (
        @id,
        @customerName,
        @customerEmail,
        @customerPhone,
        @paymentMethod,
        @paymentReference,
        @currency,
        @items,
        @totalAmount,
        @downloadLinks,
        @status
      )
    `);

    const result = await stmt.run({
      ...order,
      status: order.status ?? "pending",
    });

    return result.changes > 0;
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================

  static async update(id: string, order: Partial<Order>): boolean {
    if (Object.keys(order).length === 0) return false;

    const fields = Object.keys(order)
      .map((key) => `${key} = @${key}`)
      .join(", ");

    const stmt = await db.prepare(`
      UPDATE orders
      SET ${fields}
      WHERE id = @id
    `);

    const result = await stmt.run({
      ...order,
      id,
    });

    return result.changes > 0;
  }

  static async updateStatus(id: string, status: string, paidAt?: string): boolean {
    const result = await db.prepare(`
      UPDATE orders 
      SET status = ?, paidAt = COALESCE(?, paidAt) 
      WHERE id = ?
    `).run(status, paidAt ?? (status === "paid" ? new Date().toISOString() : null), id);

    return result.changes > 0;
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================

  static async delete(id: string): boolean {
    const result = await db.prepare("DELETE FROM orders WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // ==========================================
  // STATISTIQUES
  // ==========================================

  static async count(): number {
    const row = await db.prepare("SELECT COUNT(*) AS count FROM orders").get() as { count: number };
    return row.count;
  }

  static getTotalRevenue(): number {
    const row = await db.prepare("SELECT SUM(totalAmount) AS total FROM orders WHERE status = 'paid'").get() as { total: number | null };
    return row.total ?? 0;
  }

  static async getStatistics() {
    const totalOrders = this.count();
    const totalRevenue = this.getTotalRevenue();

    const paidOrders = (db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'paid'").get() as { count: number }).count;
    const pendingOrders = (db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'pending'").get() as { count: number }).count;

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
    };
  }

  // ==========================================
  // DIVERS
  // ==========================================

  static async exists(id: string): boolean {
    return !!db.prepare("SELECT 1 FROM orders WHERE id = ?").get(id);
  }
}