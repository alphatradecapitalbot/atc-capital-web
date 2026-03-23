const SYNC_API_URL = 'http://147.93.181.40:3001';

export async function fetchSyncedUser(telegramId: string) {
  try {
    const res = await fetch(`${SYNC_API_URL}/user/${telegramId}`);
    if (!res.ok) throw new Error('User not found');
    return await res.json();
  } catch (error) {
    console.error('Error fetching synced user:', error);
    return null;
  }
}

export async function syncDeposit(telegramId: string, amount: number) {
  try {
    const res = await fetch(`${SYNC_API_URL}/user/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId, amount })
    });
    return await res.json();
  } catch (error) {
    console.error('Error syncing deposit:', error);
    return { success: false, error: 'API Connection Error' };
  }
}
