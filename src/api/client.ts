import { supabase } from "@/integrations/supabase/client";

export type GeneratePayload = {
  topic: string;
  tone?: string;
  content_type?: string;
  subreddit_hint?: string;
  media_choice?: string;
};

export const api = {
  generate: async (payload: GeneratePayload) => {
    const { data, error } = await supabase.functions.invoke("generate", {
      body: payload,
    });
    if (error) throw error;
    return data as any;
  },
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data, error } = await supabase.functions.invoke("upload-media", {
      body: {}, // Edge Function should parse the form (to be implemented)
    });
    if (error) throw error;
    return data as any;
  },
  post: async (payload: { post_id: string; subreddit: string; auto_post_toggle: boolean; consent?: boolean }) => {
    const { data, error } = await supabase.functions.invoke("post", { body: payload });
    if (error) throw error;
    return data as any;
  },
  trends: async (params?: { window?: string; limit?: number }) => {
    const { data, error } = await supabase.functions.invoke("trends", { body: params || {} });
    if (error) throw error;
    return data as any;
  },
  analytics: async (payload: { topic: string }) => {
    const { data, error } = await supabase.functions.invoke("analytics", { body: payload });
    if (error) throw error;
    return data as any;
  },
  history: async () => {
    const { data, error } = await supabase.functions.invoke("history", { body: {} });
    if (error) throw error;
    return data as any;
  },
};
