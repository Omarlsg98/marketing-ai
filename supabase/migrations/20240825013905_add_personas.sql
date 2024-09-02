SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--type persona_info_version
CREATE TYPE public.persona_info_version AS ENUM (
   'v1'
);

-- table modifications 
-- modify persona table
ALTER TABLE public.persona DROP COLUMN image_link;
ALTER TABLE public.persona ALTER COLUMN about_me DROP NOT NULL;

ALTER TABLE public.persona ADD COLUMN chat_id UUID;
ALTER TABLE public.persona ADD COLUMN short_description TEXT NOT NULL DEFAULT 'A wonderful customer, we need more details!';
ALTER TABLE public.persona ADD COLUMN finished boolean NOT NULL DEFAULT false;

ALTER TABLE public.persona ADD COLUMN image_path text;
ALTER TABLE public.persona ADD COLUMN coverage real DEFAULT 0;

ALTER TABLE public.persona ADD COLUMN primary_goal text;
ALTER TABLE public.persona ADD COLUMN key_challenge text;
ALTER TABLE public.persona ADD COLUMN main_buying_motivation text;
ALTER TABLE public.persona ADD COLUMN gender text;
ALTER TABLE public.persona ADD COLUMN ethnicity text;
ALTER TABLE public.persona ADD COLUMN location text;
ALTER TABLE public.persona ADD COLUMN occupation text;

ALTER TABLE public.persona ADD COLUMN information JSONB;
ALTER TABLE public.persona ADD COLUMN information_version public.persona_info_version DEFAULT 'v1';

-- add relationship between persona and chat
ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.llm_chats(id);

-- move persona_id from chat to persona
UPDATE public.persona
SET chat_id = c.persona_id
FROM public.llm_chats c
WHERE c.persona_id = public.persona.id;

ALTER TABLE public.persona ALTER COLUMN chat_id SET NOT NULL;

--modify chat
ALTER TABLE public.llm_chats ADD progress real NOT NULL DEFAULT 0;
ALTER TABLE public.llm_chats DROP COLUMN persona_id;

--RLS policies
CREATE POLICY "Can insert own user data" ON public.persona FOR INSERT WITH CHECK ((auth.uid() = user_id));

--for storage
INSERT INTO storage.buckets (id, name, created_at, updated_at) VALUES ('persona_images', 'persona_images', now(), now());


CREATE POLICY "can access own storage"
ON storage.objects FOR SELECT USING (
    bucket_id = 'persona_images'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);

CREATE POLICY "can insert own storage"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'persona_images'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);

CREATE POLICY "can update own storage"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'persona_images'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'persona_images'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);
  

CREATE POLICY "can delete own storage"
ON storage.objects FOR DELETE USING (
    bucket_id = 'persona_images'
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);


RESET ALL;