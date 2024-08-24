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

--type chat_status
CREATE TYPE public.chat_status AS ENUM (
    'new',
    'in_progress',
    'closed'
);

ALTER TYPE public.chat_status OWNER TO postgres;

--type message_role
CREATE TYPE public.message_role AS ENUM (
    'user',
    'assistant',
    'system'
);

ALTER TYPE public.message_role OWNER TO postgres;

--type question_sub_category
CREATE TYPE public.question_sub_category AS ENUM (
   'Decision-Making',
   'Current Situation',
   'Background Information'
);

ALTER TYPE public.question_sub_category OWNER TO postgres;

--type question_category
CREATE TYPE public.question_category AS ENUM (
   'Persona B2B',
   'Persona B2C'
);

ALTER TYPE public.question_category OWNER TO postgres;

--type question_type
CREATE TYPE public.question_type AS ENUM (
   'text',
   'multiline',
   'number',
   'date',
   'select',
   'multi-select'
);

ALTER TYPE public.question_type OWNER TO postgres;

--llm_chats
CREATE TABLE IF NOT EXISTS public.llm_chats (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    title text NOT NULL,
    description text,
    category public.question_category NOT NULL,
    user_id uuid NOT NULL,
    status public.chat_status NOT NULL DEFAULT 'new'::public.chat_status,
    last_question_id integer,
    persona_id uuid,
    context text
);

--llm_messages
CREATE TABLE IF NOT EXISTS public.llm_messages (
    id serial NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    content text NOT NULL,
    role  public.message_role NOT NULL,
    chat_id uuid NOT NULL,
    user_id uuid NOT NULL
);

--user_answers_sources
CREATE TABLE IF NOT EXISTS public.user_answers_sources (
    user_answer_id integer NOT NULL,
    message_id integer NOT NULL,
    user_id uuid NOT NULL    
);

--persona
CREATE TABLE IF NOT EXISTS public.persona (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    about_me text NOT NULL,
    user_id uuid NOT NULL,
    image_link text NOT NULL
);

--user_answers
CREATE TABLE IF NOT EXISTS public.user_answers (
    id serial NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    question_id integer NOT NULL,
    chat_id uuid NOT NULL,
    persona_id uuid,
    answer text NOT NULL,
    user_id uuid NOT NULL
);


--questions
CREATE TABLE IF NOT EXISTS public.questions (
    id serial NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    q_order int4 NOT NULL,
    question text NOT NULL,
    q_type public.question_type NOT NULL,
    category public.question_category NOT NULL,
    sub_category public.question_sub_category NOT NULL
);

--question_options
CREATE TABLE IF NOT EXISTS public.question_options (
    id serial NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    deleted_at timestamp with time zone,
    question_id integer NOT NULL,
    q_option text NOT NULL
);



--primary keys
ALTER TABLE ONLY public.llm_chats
    ADD CONSTRAINT llm_chats_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.llm_messages
    ADD CONSTRAINT llm_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_answers_sources
    ADD CONSTRAINT user_answers_sources_pkey PRIMARY KEY (user_answer_id, message_id);

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT question_options_pkey PRIMARY KEY (id);

--foreign keys
ALTER TABLE ONLY public.llm_chats
    ADD CONSTRAINT llm_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.llm_chats
    ADD CONSTRAINT llm_chats_last_question_id_fkey FOREIGN KEY (last_question_id) REFERENCES public.questions(id);

ALTER TABLE ONLY public.llm_chats
    ADD CONSTRAINT llm_chats_persona_id_fkey FOREIGN KEY (persona_id) REFERENCES public.persona(id);

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.llm_messages
    ADD CONSTRAINT llm_messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.llm_chats(id);

ALTER TABLE ONLY public.llm_messages
    ADD CONSTRAINT llm_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.user_answers_sources
    ADD CONSTRAINT user_answers_sources_user_answer_id_fkey FOREIGN KEY (user_answer_id) REFERENCES public.user_answers(id);

ALTER TABLE ONLY public.user_answers_sources
    ADD CONSTRAINT user_answers_sources_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.llm_messages(id);

ALTER TABLE ONLY public.user_answers_sources
    ADD CONSTRAINT user_answers_sources_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_persona_id_fkey FOREIGN KEY (persona_id) REFERENCES public.persona(id);

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.llm_chats(id);

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT question_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);

--RLS policies

CREATE POLICY "Can update own user data." ON public.llm_chats FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data." ON public.llm_chats FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can insert own user data." ON public.llm_chats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own user data." ON public.llm_messages FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data." ON public.llm_messages FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can insert own user data." ON public.llm_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own user data" ON public.persona FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data" ON public.persona FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can update own user data." ON public.user_answers FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data." ON public.user_answers FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can insert own user data." ON public.user_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own user data." ON public.user_answers_sources FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Can view own user data." ON public.user_answers_sources FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can insert own user data." ON public.user_answers_sources FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all questions" ON public.questions FOR SELECT USING (true);

CREATE POLICY "Users can view all question options" ON public.question_options FOR SELECT USING (true);

--enable RLS

ALTER TABLE public.llm_chats ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.llm_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.persona ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_answers_sources ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

--GRANT permissions

GRANT ALL ON TABLE public.llm_chats TO anon;
GRANT ALL ON TABLE public.llm_chats TO authenticated;
GRANT ALL ON TABLE public.llm_chats TO service_role;

GRANT ALL ON TABLE public.llm_messages TO anon;
GRANT ALL ON TABLE public.llm_messages TO authenticated;
GRANT ALL ON TABLE public.llm_messages TO service_role;

GRANT ALL ON TABLE public.persona TO anon;
GRANT ALL ON TABLE public.persona TO authenticated;
GRANT ALL ON TABLE public.persona TO service_role;

GRANT ALL ON TABLE public.user_answers TO anon;
GRANT ALL ON TABLE public.user_answers TO authenticated;
GRANT ALL ON TABLE public.user_answers TO service_role;

GRANT ALL ON TABLE public.user_answers_sources TO anon;
GRANT ALL ON TABLE public.user_answers_sources TO authenticated;
GRANT ALL ON TABLE public.user_answers_sources TO service_role;

GRANT ALL ON TABLE public.questions TO anon;
GRANT ALL ON TABLE public.questions TO authenticated;
GRANT ALL ON TABLE public.questions TO service_role;

GRANT ALL ON TABLE public.question_options TO anon;
GRANT ALL ON TABLE public.question_options TO authenticated;
GRANT ALL ON TABLE public.question_options TO service_role;

RESET ALL;