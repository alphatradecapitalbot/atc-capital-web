import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ADMIN_IDS = [523694323, 5073465344];

async function verifyAdmin(supabase: any) {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('id, telegram_id, role')
    .or(`supabase_id.eq.${authUser.id},email.eq.${authUser.email}`)
    .single();

  if (!userData || (!ADMIN_IDS.includes(parseInt(userData.telegram_id)) && userData.role !== 'admin')) {
    return null;
  }
  return userData;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const admin = await verifyAdmin(supabase);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
