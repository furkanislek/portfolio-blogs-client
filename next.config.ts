import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API: "https://portfolio-blogs-backend.vercel.app/api",
    NEXT_PUBLIC_SUPABASE_URL: "https://qqhkuxtkfzejqnldouzo.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaGt1eHRrZnplanFubGRvdXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNjgzNzMsImV4cCI6MjA3NTg0NDM3M30.uBkZG2JY-Kqj8g3HtJxcVP3XXVSbOvebcRt1ONzne0A",
  },
};

export default nextConfig;
