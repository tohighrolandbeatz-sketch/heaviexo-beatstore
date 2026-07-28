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

  static getAll(): Order[] {
    return db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as Order[];
  }

  static getById(id: string): Order | undefined {
    return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  }

  static getByEmail(email: string): Order[] {
    return db.prepare("SELECT * FROM orders WHERE customerEmail = ? ORDER BY createdAt DESC").all(email) as Order[];
  }

  static getByStatus(status: string): Order[] {
    return db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY createdAt DESC").all(status) as Order[];
  }

  // ==========================================
  // CRÉATION
  // ==========================================

  static create(order: Order): boolean {
    const stmt = db.prepare(`
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

    const result = stmt.run({
      ...order,
      status: order.status ?? "pending",
    });

    return result.changes > 0;
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================

  static update(id: string, order: Partial<Order>): boolean {
    if (Object.keys(order).length === 0) return false;

    const fields = Object.keys(order)
      .map((key) => `${key} = @${key}`)
      .join(", ");

    const stmt = db.prepare(`
      UPDATE orders
      SET ${fields}
      WHERE id = @id
    `);

    const result = stmt.run({
      ...order,
      id,
    });

    return result.changes > 0;
  }

  static updateStatus(id: string, status: string, paidAt?: string): boolean {
    const result = db.prepare(`
      UPDATE orders 
      SET status = ?, paidAt = COALESCE(?, paidAt) 
      WHERE id = ?
    `).run(status, paidAt ?? (status === "paid" ? new Date().toISOString() : null), id);

    return result.changes > 0;
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================

  static delete(id: string): boolean {
    const result = db.prepare("DELETE FROM orders WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // ==========================================
  // STATISTIQUES
  // ==========================================

  static count(): number {
    const row = db.prepare("SELECT COUNT(*) AS count FROM orders").get() as { count: number };
    return row.count;
  }

  static getTotalRevenue(): number {
    const row = db.prepare("SELECT SUM(totalAmount) AS total FROM orders WHERE status = 'paid'").get() as { total: number | null };
    return row.total ?? 0;
  }

  static getStatistics() {
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

  static exists(id: string): boolean {
    return !!db.prepare("SELECT 1 FROM orders WHERE id = ?").get(id);
  }
}