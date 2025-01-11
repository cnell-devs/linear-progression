import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nsrjlbjykmanilwxqxtb.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcmpsYmp5a21hbmlsd3hxeHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MzMzNjUsImV4cCI6MjA1MjIwOTM2NX0.JaHT7CAf7PrUqT9dkretuj5Ed3JxUS5J65gKebtoMEQ"; // Replace with your Public Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
