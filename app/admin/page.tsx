import { Music, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { beats, sales, users } from '@/app/config/schema';
import { count, sum } from 'drizzle-orm';

export default async function AdminDashboardPage() {
  let beatCountResult = [{ count: 0 }];
  let saleCountResult = [{ count: 0 }];
  let userCountResult = [{ count: 0 }];
  let totalRevenueResult = [{ total: 0 }];

  try { beatCountResult = await db.select({ count: count() }).from(beats); } catch (e) {}
  try { saleCountResult = await db.select({ count: count() }).from(sales); } catch (e) {}
  try { userCountResult = await db.select({ count: count() }).from(users); } catch (e) {}
  try { totalRevenueResult = await db.select({ total: sum(sales.amount) }).from(sales); } catch (e) {}

  const beatCount = beatCountResult[0]?.count || 0;
  const saleCount = saleCountResult[0]?.count || 0;
  const userCount = userCountResult[0]?.count || 0;
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Tableau de bord Admin</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5">
          <Music className="w-5 h-5 text-red-500 mb-2" />
          <span className="text-xs text-gray-400">Beats</span>
          <span className="text-2xl font-bold text-white block">{beatCount}</span>
        </div>
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5">
          <ShoppingCart className="w-5 h-5 text-green-500 mb-2" />
          <span className="text-xs text-gray-400">Ventes</span>
          <span className="text-2xl font-bold text-white block">{saleCount}</span>
        </div>
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5">
          <Users className="w-5 h-5 text-blue-500 mb-2" />
          <span className="text-xs text-gray-400">Utilisateurs</span>
          <span className="text-2xl font-bold text-white block">{userCount}</span>
        </div>
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5">
          <DollarSign className="w-5 h-5 text-yellow-500 mb-2" />
          <span className="text-xs text-gray-400">Revenu total</span>
          <span className="text-2xl font-bold text-white block">{totalRevenue} €</span>
        </div>
      </div>
    </div>
  );
}
