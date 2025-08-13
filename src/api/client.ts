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
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return { url: urlData.publicUrl, path: fileName };
  },
  post: async (payload: { post_id: string; subreddit: string; auto_post_toggle: boolean; consent?: boolean; title?: string; content?: string }) => {
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
