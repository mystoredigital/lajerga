import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a mock client that returns empty data when Supabase is not configured
    return {
      from: () => ({
        select: () => ({
          eq: function() { return this },
          neq: function() { return this },
          or: function() { return this },
          order: function() { return this },
          limit: function() { return this },
          single: () => Promise.resolve({ data: null, error: null }),
          then: (resolve: (value: { data: null; error: null }) => void) => resolve({ data: null, error: null }),
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createClient>
  }

  return createClient(url, key)
}
