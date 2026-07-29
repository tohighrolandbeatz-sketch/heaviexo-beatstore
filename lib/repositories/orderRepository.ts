import { db } from '@/lib/db';
import { pgTable, text, real, timestamp } from 'drizzle-orm/pg-core';
import { eq, desc, count, sum, sql } from 'drizzle-orm';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  currency: text('currency'),
  items: text('items'),
  totalAmount: real('total_amount'),
  downloadLinks: text('download_links'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export interface Order {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  paymentReference?: string;
  currency?: string;
  items?: string;
  totalAmount?: number;
  downloadLinks?: string;
  status?: string;
  createdAt?: string;
  paidAt?: string;
}

function mapOrder(row: typeof orders.$inferSelect): Order {
  return {
    id: row.id,
    customerName: row.customerName ?? undefined,
    customerEmail: row.customerEmail ?? undefined,
    customerPhone: row.customerPhone ?? undefined,
    paymentMethod: row.paymentMethod ?? undefined,
    paymentReference: row.paymentReference ?? undefined,
    currency: row.currency ?? undefined,
    items: row.items ?? undefined,
    totalAmount: row.totalAmount ?? undefined,
    downloadLinks: row.downloadLinks ?? undefined,
    status: row.status ?? undefined,
    createdAt: row.createdAt.toISOString(),
    paidAt: row.paidAt ? row.paidAt.toISOString() : undefined,
  };
}

export class OrderRepository {
  // ==========================================
  // LECTURE
  // ==========================================

  static async getAll(): Promise<Order[]> {
    const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return result.map(mapOrder);
  }

  static async getById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!result[0]) return undefined;
    return mapOrder(result[0]);
  }

  static async getByEmail(email: string): Promise<Order[]> {
    const result = await db.select().from(orders).where(eq(orders.customerEmail, email)).orderBy(desc(orders.createdAt));
    return result.map(mapOrder);
  }

  static async getByStatus(status: string): Promise<Order[]> {
    const result = await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
    return result.map(mapOrder);
  }

  // ==========================================
  // CRÉATION
  // ==========================================

  static async create(order: Order): Promise<boolean> {
    try {
      const now = new Date();
      await db.insert(orders).values({
        id: order.id,
        customerName: order.customerName ?? null,
        customerEmail: order.customerEmail ?? null,
        customerPhone: order.customerPhone ?? null,
        paymentMethod: order.paymentMethod ?? null,
        paymentReference: order.paymentReference ?? null,
        currency: order.currency ?? null,
        items: order.items ?? null,
        totalAmount: order.totalAmount ?? null,
        downloadLinks: order.downloadLinks ?? null,
        status: order.status ?? 'pending',
        createdAt: order.createdAt ? new Date(order.createdAt) : now,
        paidAt: order.paidAt ? new Date(order.paidAt) : null,
        updatedAt: now,
      });
      return true;
    } catch {
      return false;
    }
  }

  // ==========================================
  // MISE À JOUR
  // ==========================================

  static async update(id: string, order: Partial<Order>): Promise<boolean> {
    if (Object.keys(order).length === 0) return false;

    try {
      await db
        .update(orders)
        .set({
          ...(order.customerName !== undefined && { customerName: order.customerName }),
          ...(order.customerEmail !== undefined && { customerEmail: order.customerEmail }),
          ...(order.customerPhone !== undefined && { customerPhone: order.customerPhone }),
          ...(order.paymentMethod !== undefined && { paymentMethod: order.paymentMethod }),
          ...(order.paymentReference !== undefined && { paymentReference: order.paymentReference }),
          ...(order.currency !== undefined && { currency: order.currency }),
          ...(order.items !== undefined && { items: order.items }),
          ...(order.totalAmount !== undefined && { totalAmount: order.totalAmount }),
          ...(order.downloadLinks !== undefined && { downloadLinks: order.downloadLinks }),
          ...(order.status !== undefined && { status: order.status }),
          ...(order.paidAt !== undefined && { paidAt: order.paidAt ? new Date(order.paidAt) : null }),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id));

      return true;
    } catch {
      return false;
    }
  }

  static async updateStatus(id: string, status: string, paidAt?: string): Promise<boolean> {
    try {
      const existing = await OrderRepository.getById(id);
      if (!existing) return false;

      const newPaidAt = paidAt 
        ? new Date(paidAt) 
        : status === 'paid' && !existing.paidAt 
          ? new Date() 
          : existing.paidAt ? new Date(existing.paidAt) : null;

      await db
        .update(orders)
        .set({
          status,
          paidAt: newPaidAt,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id));

      return true;
    } catch {
      return false;
    }
  }

  // ==========================================
  // SUPPRESSION
  // ==========================================

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ==========================================
  // STATISTIQUES
  // ==========================================

  static async count(): Promise<number> {
    const result = await db.select({ count: count() }).from(orders);
    return result[0]?.count ?? 0;
  }

  static async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, 'paid'));
    return Number(result[0]?.total ?? 0);
  }

  static async getStatistics() {
    const totalOrders = await this.count();
    const totalRevenue = await this.getTotalRevenue();

    const paidResult = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, 'paid'));
    const paidOrders = paidResult[0]?.count ?? 0;

    const pendingResult = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, 'pending'));
    const pendingOrders = pendingResult[0]?.count ?? 0;

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

  static async exists(id: string): Promise<boolean> {
    const result = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1);
    return result.length > 0;
  }
}