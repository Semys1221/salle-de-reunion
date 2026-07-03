const DAILY_API_BASE = "https://api.daily.co/v1";
const DAILY_API_KEY = process.env.DAILY_API_KEY;

export interface DailyRoom {
  id: string;
  name: string;
  privacy: "public" | "private";
  url: string;
  created_at: string;
  config: {
    enable_chat: boolean;
    enable_prejoin_ui: boolean;
    enable_recording: string;
    lang: string;
    meeting_join_hook?: string;
    enable_pip_ui?: boolean;
    enable_knocking?: boolean;
  };
}

export function dailyHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${DAILY_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function getRoom(roomName: string): Promise<DailyRoom | null> {
  if (!DAILY_API_KEY) return null;

  try {
    const res = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
      headers: dailyHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return (await res.json()) as DailyRoom;
  } catch {
    return null;
  }
}

export function isApiConfigured(): boolean {
  return Boolean(DAILY_API_KEY);
}
