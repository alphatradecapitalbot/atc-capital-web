import { NextResponse } from 'next/response';
import { supabase } from '@/lib/supabase';

// Helper to get authenticated user
async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { 'Authorization': authHeader }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error("Auth fetch error:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    
    if (!user || (!user.id && !user.telegram_id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Fetch up-to-date user data from Supabase
    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('balance, adsWatched, adsToday, lastAdAt')
      .eq('id', userId)
      .single();

    if (fetchErr || !userData) {
      console.error("Fetch Error:", fetchErr);
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

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
