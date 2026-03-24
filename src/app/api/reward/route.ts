import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Fetch up-to-date user data from Supabase
    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('id, balance, adsWatched, adsToday, lastAdAt')
      .or(`supabase_id.eq.${authUser.id},email.eq.${authUser.email}`)
      .single();

    if (fetchErr || !userData) {
      console.error("Fetch Error:", fetchErr);
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const userId = userData.id;

    // Check limits
    const now = new Date();
    const lastAdAt = userData.lastAdAt ? new Date(userData.lastAdAt) : null;
    let adsToday = userData.adsToday || 0;
    
    // Check if it's a new day to reset adsToday
    if (lastAdAt) {
      const isSameDay = 
        lastAdAt.getUTCDate() === now.getUTCDate() &&
        lastAdAt.getUTCMonth() === now.getUTCMonth() &&
        lastAdAt.getUTCFullYear() === now.getUTCFullYear();
      
      if (!isSameDay) {
        adsToday = 0; // Reset for new day
      }
    }

    // Limit to 20 per day
    if (adsToday >= 20) {
      return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
    }

    // Cooldown 30 seconds
    if (lastAdAt) {
      const diffMs = now.getTime() - lastAdAt.getTime();
      if (diffMs < 30000) {
        return NextResponse.json({ error: 'Cooldown active. Please wait 30s.' }, { status: 429 });
      }
    }

    // Update DB
    const newBalance = (userData.balance || 0) + 0.004;
    const newAdsWatched = (userData.adsWatched || 0) + 1;
    adsToday += 1;

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        adsWatched: newAdsWatched,
        adsToday: adsToday,
        lastAdAt: now.toISOString()
      })
      .eq('id', userId);

    if (updateErr) {
      console.error('Failed to update DB:', updateErr);
      return NextResponse.json({ error: 'Internal server error while updating balance' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reward: 0.004,
      balance: newBalance,
      adsWatched: newAdsWatched,
      adsToday: adsToday
    });

  } catch (error) {
    console.error('Reward API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
