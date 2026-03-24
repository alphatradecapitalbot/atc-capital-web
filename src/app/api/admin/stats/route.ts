import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ADMIN_IDS = [523694323, 5073465344];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if admin in DB
    const { data: userData } = await supabase
      .from('users')
      .select('id, telegram_id, role')
      .or(`supabase_id.eq.${authUser.id},email.eq.${authUser.email}`)
      .single();

    if (!userData || (!ADMIN_IDS.includes(parseInt(userData.telegram_id)) && userData.role !== 'admin')) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    // Fetch Stats
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    
    const { data: depositsToday } = await supabase
      .from('deposits')
      .select('amount')
      .gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString());

    const totalDepositsToday = depositsToday?.reduce((acc, d) => acc + d.amount, 0) || 0;

    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('status', 'approved');

    const totalPaid = withdrawals?.reduce((acc, w) => acc + w.amount, 0) || 0;

    const { data: activeInvestments } = await supabase
      .from('investments')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    return NextResponse.json({
      active_users: totalUsers || 0,
      total_deposits_today: totalDepositsToday,
      total_paid: totalPaid,
      active_investments: activeInvestments?.length || 0,
      system_volume: totalPaid + 150000, // Placeholder volume
      new_users_today: 5 // Placeholder
    });

  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
