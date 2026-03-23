import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id: telegram_id, username, first_name, last_name, auth_date, hash } = body;

    // Basic validation
    if (!telegram_id) {
      return NextResponse.json({ error: "Datos de Telegram inválidos." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Upsert user — won't overwrite existing data
    const { data: user, error } = await supabase
      .from("users")
      .upsert(
        {
          telegram_id: telegram_id.toString(),
          username: username || null,
          first_name: first_name || "Usuario",
        },
        {
          onConflict: "telegram_id",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Upsert error:", error);
      return NextResponse.json({ error: "Error registrando usuario." }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
