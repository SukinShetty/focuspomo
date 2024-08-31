import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wtpttzlxihrvbitkmnrx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwdHR6bHhpaHJ2Yml0a21ucnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyMjYyNjgsImV4cCI6MjAzNzgwMjI2OH0.55555555555555555555555555555555555555555555555555'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)