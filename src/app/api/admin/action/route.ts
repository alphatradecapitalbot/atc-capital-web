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

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const admin = await verifyAdmin(supabase);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const body = await req.json();
    const { action, userId, status, amount, type } = body;

    if (action === 'toggleBlock') {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'updateBalance') {
      const { data: user, error: fetchErr } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();
      
      if (fetchErr) throw fetchErr;

      let newBalance = user.balance;
      if (type === 'set') newBalance = amount;
      else if (type === 'add') newBalance = user.balance + amount;
      else if (type === 'sub') newBalance = user.balance - amount;

      const { error: updateErr } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);
      
      if (updateErr) throw updateErr;
      return NextResponse.json({ success: true });
    }

    if (action === 'approveDeposit') {
       const { data: dep } = await supabase.from('deposits').select('*').eq('id', body.depositId).single();
       if (!dep) return NextResponse.json({ error: "Depósito no encontrado" }, { status: 404 });
       
       const { error: updDep } = await supabase.from('deposits').update({ status: 'approved' }).eq('id', body.depositId);
       if (updDep) throw updDep;

       const { data: usr } = await supabase.from('users').select('balance').eq('id', dep.user_id).single();
       if (usr) {
         await supabase.from('users').update({ balance: (usr.balance || 0) + dep.amount }).eq('id', dep.user_id);
       }
       return NextResponse.json({ success: true });
    }

    if (action === 'rejectDeposit') {
       const { error } = await supabase.from('deposits').update({ status: 'rejected' }).eq('id', body.depositId);
       if (error) throw error;
       return NextResponse.json({ success: true });
    }

    if (action === 'approveWithdrawal') {
       const { error } = await supabase.from('withdrawals').update({ status: 'approved' }).eq('id', body.withdrawalId);
       if (error) throw error;
       return NextResponse.json({ success: true });
    }

    if (action === 'rejectWithdrawal') {
       const { data: w } = await supabase.from('withdrawals').select('*').eq('id', body.withdrawalId).single();
       if (!w) return NextResponse.json({ error: "Retiro no encontrado" }, { status: 404 });

       const { error: updW } = await supabase.from('withdrawals').update({ status: 'rejected' }).eq('id', body.withdrawalId);
       if (updW) throw updW;

       // Restore balance to user? Usually when rejected, we give it back
       const { data: usr } = await supabase.from('users').select('balance').eq('id', w.user_id).single();
       if (usr) {
          await supabase.from('users').update({ balance: (usr.balance || 0) + w.amount }).eq('id', w.user_id);
       }
       return NextResponse.json({ success: true });
    }

    if (action === 'forcePayout') {
       const { data: inv } = await supabase.from('investments').select('*').eq('id', body.investmentId).single();
       if (!inv) return NextResponse.json({ error: "Inversión no encontrada" }, { status: 404 });

       await supabase.from('investments').update({ status: 'completed' }).eq('id', body.investmentId);

       const { data: usr } = await supabase.from('users').select('balance').eq('id', inv.user_id).single();
       if (usr) {
          const total = (usr.balance || 0) + Number(inv.amount) + Number(inv.profit);
          await supabase.from('users').update({ balance: total }).eq('id', inv.user_id);
       }
       return NextResponse.json({ success: true });
    }

    if (action === 'deleteInvestment') {
       const { error } = await supabase.from('investments').delete().eq('id', body.investmentId);
       if (error) throw error;
       return NextResponse.json({ success: true });
    }

    if (action === 'manualInvest') {
       const { userId, plan, amount } = body;
       const expiresAt = new Date();
       expiresAt.setDate(expiresAt.getDate() + 1); // 24h default

       const { error } = await supabase.from('investments').insert({
         user_id: userId,
         plan,
         amount: amount || 0,
         profit: (amount || 0) * 0.05, // 5% default
         status: 'active',
         type: 'manual',
         expires_at: expiresAt.toISOString()
       });
       if (error) throw error;
       return NextResponse.json({ success: true });
    }

    if (action === 'updateAds') {
       return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });

  } catch (error: any) {
    console.error("Admin Action Error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
