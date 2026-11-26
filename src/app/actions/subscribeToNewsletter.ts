"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function subscribeToNewsletter(email: string) {
  const trimmed = (email || "").trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { error } = await supabase
    .from("subscribers")
    .insert([{ email: trimmed }]);

  // Duplicate email (unique constraint) - treat as success
  if (error?.code === "23505") {
    return { success: true };
  }
  if (error) {
    console.error("[subscribeToNewsletter]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
