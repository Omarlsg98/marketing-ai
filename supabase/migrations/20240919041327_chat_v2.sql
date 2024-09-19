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


DROP TABLE public.leads;
DROP TABLE public.lemon_squeezy_customers;
DROP TABLE public.lemon_squeezy_subscriptions;
DROP TABLE public.stripe_customers;
DROP TABLE public.stripe_subscriptions;
DROP TABLE public.user_answers_sources;
DROP TABLE public.user_answers;
DROP TABLE public.question_options;


ALTER TABLE public.persona DROP COLUMN information_version;
ALTER TABLE public.persona DROP COLUMN chat_id;
ALTER TABLE public.persona DROP COLUMN primary_goal;
ALTER TABLE public.persona DROP COLUMN key_challenge;
ALTER TABLE public.persona DROP COLUMN main_buying_motivation;
Alter TABLE public.persona DROP COLUMN gender;
ALTER TABLE public.persona DROP COLUMN ethnicity;
Alter TABLE public.persona DROP COLUMN location;
Alter TABLE public.persona DROP COLUMN occupation;


ALTER TABLE public.persona ADD COLUMN version numeric NOT NULL DEFAULT 1;
ALTER TABLE public.persona ADD COLUMN author public.message_role NOT NULL;

-- change primary key to one composed of id and version
ALTER TABLE public.persona DROP CONSTRAINT persona_pkey;
ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id, version);

DROP TYPE public.persona_info_version;

TRUNCATE TABLE public.llm_messages;
DELETE 
FROM public.llm_chats;

ALTER TABLE public.llm_chats DROP COLUMN category;
ALTER TABLE public.llm_chats DROP COLUMN last_question_id;
DROP TABLE public.questions;

ALTER TABLE public.llm_chats ADD COLUMN state text NOT NULL DEFAULT 'initial';
ALTER TABLE public.llm_chats ADD COLUMN is_first_interaction boolean NOT NULL DEFAULT true;
ALTER TABLE public.llm_chats ADD COLUMN last_message_id_in_context numeric;
ALTER TABLE public.llm_chats ADD COLUMN display_info JSONB;
ALTER TABLE public.llm_chats ADD COLUMN substep_id numeric;
ALTER TABLE public.llm_chats ADD COLUMN object_context_id text;


CREATE TABLE IF NOT EXISTS public.customer_journey (
    id uuid NOT NULL,
    version numeric NOT NULL DEFAULT 1,
    author public.message_role NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    information JSONB,
    persona_id uuid NOT NULL,
    persona_version numeric NOT NULL
);

ALTER TABLE ONLY public.customer_journey
    ADD CONSTRAINT customer_journey_pkey PRIMARY KEY (id, version);

-- foreign key to persona
ALTER TABLE public.customer_journey 
    ADD CONSTRAINT fk_customer_journey_persona_id FOREIGN KEY (persona_id, persona_version) REFERENCES public.persona(id, version);


--RLS POLICIES
CREATE POLICY "Can update own user data." ON public.customer_journey FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data." ON public.customer_journey FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can insert own user data." ON public.customer_journey FOR INSERT WITH CHECK (auth.uid() = user_id);

--enable RLS

ALTER TABLE public.customer_journey ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.customer_journey TO anon;
GRANT ALL ON TABLE public.customer_journey TO authenticated;
GRANT ALL ON TABLE public.customer_journey TO service_role;

--create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_journey_updated_at
BEFORE UPDATE ON public.customer_journey
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_persona_updated_at
BEFORE UPDATE ON public.persona
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_llm_chats_updated_at
BEFORE UPDATE ON public.llm_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

RESET ALL;