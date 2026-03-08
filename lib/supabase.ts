import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
    }
    _client = createClient(url, key);
  }
  return _client;
}

// 기존 코드 호환용 — 클라이언트 렌더링 시에만 사용
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  storage: {
    from: (bucket: string) => getSupabase().storage.from(bucket),
  },
};
