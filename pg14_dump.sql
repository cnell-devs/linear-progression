--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE nharris;
ALTER ROLE nharris WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:nKTJGlVZ6W61qlP8mITiLg==$QDASyUq5d89+paxhX1OwIoOvDh0e1zRrFBwNr7Chm4o=:Qn38pJ/PacpNjQYCUEB6HI409+XaTYbVB1GAcFFldJA=';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- PostgreSQL database dump complete
--

--
-- Database "hello_prisma" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: hello_prisma; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE hello_prisma WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE hello_prisma OWNER TO nharris;

\connect hello_prisma

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    published boolean DEFAULT false NOT NULL,
    "authorId" integer NOT NULL
);


ALTER TABLE public."Post" OWNER TO nharris;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Post_id_seq" OWNER TO nharris;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: Profile; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public."Profile" (
    id integer NOT NULL,
    bio text,
    "userId" integer NOT NULL
);


ALTER TABLE public."Profile" OWNER TO nharris;

--
-- Name: Profile_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public."Profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Profile_id_seq" OWNER TO nharris;

--
-- Name: Profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public."Profile_id_seq" OWNED BY public."Profile".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text
);


ALTER TABLE public."User" OWNER TO nharris;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO nharris;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nharris;

--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: Profile id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Profile" ALTER COLUMN id SET DEFAULT nextval('public."Profile_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public."Post" (id, "createdAt", "updatedAt", title, content, published, "authorId") FROM stdin;
1	2024-12-23 16:42:22.578	2024-12-23 16:47:54.426	Hello World	\N	t	1
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public."Profile" (id, bio, "userId") FROM stdin;
1	I like turtles	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public."User" (id, email, name) FROM stdin;
1	alice@prisma.io	Alice
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
cc1e44a6-94ee-4366-ae11-eb69bbadd8d0	3de9e0465a22932a5a941f8f9a96591ac8be6d3e3bcbd66871fde9b0902d33c0	2024-12-23 11:34:00.231862-05	20241223163400_init	\N	\N	2024-12-23 11:34:00.211512-05	1
\.


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public."Post_id_seq"', 1, true);


--
-- Name: Profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public."Profile_id_seq"', 1, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Profile_userId_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Profile Profile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- Database "linear_ppl" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: linear_ppl; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE linear_ppl WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE linear_ppl OWNER TO nharris;

\connect linear_ppl

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

--
-- Name: split; Type: TYPE; Schema: public; Owner: nharris
--

CREATE TYPE public.split AS ENUM (
    'push',
    'pull',
    'legs'
);


ALTER TYPE public.split OWNER TO nharris;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nharris;

--
-- Name: tokens; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone DEFAULT (now() + '01:00:00'::interval) NOT NULL
);


ALTER TABLE public.tokens OWNER TO nharris;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tokens_id_seq OWNER TO nharris;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "templateOrder" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_preferences OWNER TO nharris;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_preferences_id_seq OWNER TO nharris;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.users (
    id text NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text,
    verified boolean DEFAULT false NOT NULL,
    "lastLogin" date DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO nharris;

--
-- Name: weightentry; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.weightentry (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "workoutId" integer NOT NULL,
    weight integer NOT NULL,
    date date DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.weightentry OWNER TO nharris;

--
-- Name: weightentry_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.weightentry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.weightentry_id_seq OWNER TO nharris;

--
-- Name: weightentry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.weightentry_id_seq OWNED BY public.weightentry.id;


--
-- Name: workout; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.workout (
    id integer NOT NULL,
    name text NOT NULL,
    sets integer NOT NULL,
    reps text NOT NULL,
    amrap boolean DEFAULT false NOT NULL,
    type public.split NOT NULL,
    "supersettedId" integer,
    "alternateId" integer,
    alt boolean DEFAULT false NOT NULL,
    ss boolean DEFAULT false NOT NULL,
    "isTemplate" boolean DEFAULT false NOT NULL,
    "templateId" integer,
    "workoutId" integer,
    "isGlobal" boolean DEFAULT true NOT NULL,
    "userId" text
);


ALTER TABLE public.workout OWNER TO nharris;

--
-- Name: workout_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.workout_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workout_id_seq OWNER TO nharris;

--
-- Name: workout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.workout_id_seq OWNED BY public.workout.id;


--
-- Name: workout_template; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.workout_template (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.workout_template OWNER TO nharris;

--
-- Name: workout_template_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.workout_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workout_template_id_seq OWNER TO nharris;

--
-- Name: workout_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.workout_template_id_seq OWNED BY public.workout_template.id;


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- Name: weightentry id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.weightentry ALTER COLUMN id SET DEFAULT nextval('public.weightentry_id_seq'::regclass);


--
-- Name: workout id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout ALTER COLUMN id SET DEFAULT nextval('public.workout_id_seq'::regclass);


--
-- Name: workout_template id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout_template ALTER COLUMN id SET DEFAULT nextval('public.workout_template_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6571a3ea-07e9-442c-ac0d-81115c2f6b23	c722023c8865f8b38b0452315e48e10ef35ff26de35011adadbaf72f5fcb66a7	2025-01-09 23:08:12.503851-05	20250110040812_date	\N	\N	2025-01-09 23:08:12.490611-05	1
ec2799b8-0c2a-4ae1-bea7-6b6d69c27348	71de1876a75017a187d38b8b3c2b24b031ae9d3bc9143b6172afcd82d35bcb17	2025-01-07 19:15:42.615772-05	20250108001542_init	\N	\N	2025-01-07 19:15:42.599953-05	1
cd3af93b-6fea-4ca9-9dc8-9ea323d53296	512a3061e9229cdc20da307e4e56da83a7d419bc3e0daa987b6a465dbdef8ed7	2025-01-07 19:24:22.097309-05	20250108002422_supersets	\N	\N	2025-01-07 19:24:22.091916-05	1
de21857e-cb29-4427-a245-d180609713c6	18bc9f63f7290d91bc01f3c1c2c22f4a93e91837674f814f1e60ca072ae443d6	2025-01-17 00:01:58.17579-05	20250117050158_time_fix	\N	\N	2025-01-17 00:01:58.174296-05	1
3d2fd941-3e7b-4a61-8e42-fc2371a8ebad	82071daeafcaf174576303dfe999cc2f517a6b5b7a182d614ac7bb93b5c0c726	2025-01-07 19:34:38.308999-05	20250108003438_alternates	\N	\N	2025-01-07 19:34:38.305541-05	1
7a34dc04-41a5-4ea2-bb5c-c9130a4cbf3e	04c9ab339ce4d40338677d16626d2952c4f3c31c53fd6c92b195e8b62c76fba3	2025-01-09 23:47:44.242612-05	20250110044744_altbool	\N	\N	2025-01-09 23:47:44.240076-05	1
f3d11b8b-4e34-4aae-a91a-36e7f4f0c1dc	3f8760fcd34c5bb47a5ba754b797d1b140a0df8143a34f88074e7312dd727a5b	2025-01-07 19:35:57.372019-05	20250108003557_alternates	\N	\N	2025-01-07 19:35:57.366945-05	1
eea6ff04-2d3a-44db-ba99-61ebeb982409	d0b87d7fda8a4651101a9df0a1f3e54373915c9060d8164239ee59e91df97ecf	2025-01-07 19:39:23.370723-05	20250108003923_amrap	\N	\N	2025-01-07 19:39:23.368345-05	1
2f6cef00-5ae9-4538-b076-4c68e5cf0721	e9c8259954a64b734f0666ab3b5f2bd7bf3341910224b760f331335956b6d7b5	2025-01-07 19:40:52.169185-05	20250108004052_amrapboolean	\N	\N	2025-01-07 19:40:52.166944-05	1
3be9275e-0b4d-4a82-bfaf-cf83f457cd88	d0c66b3d82b322cca79008d68a26a7978869e7f793039d6cc1edce805e4ed4a9	2025-01-09 23:48:58.436562-05	20250110044858_ssbool	\N	\N	2025-01-09 23:48:58.434397-05	1
3c88dbbb-a591-40c2-b917-bf4dd020b796	ce42e0a905ef6d80ee3054bfd287a1ef81c2960608cc5c2c77f407bc353ae1df	2025-01-07 19:44:06.825313-05	20250108004406_string_reps	\N	\N	2025-01-07 19:44:06.81772-05	1
f51a37d0-b1a9-4a91-8eeb-52d5a9d22b4e	386e636aa64b97c6f8076f7c40ddf256aa6b7aaa1f62ab6013600eed292f060e	2025-01-07 19:45:01.017454-05	20250108004501_rm_initial	\N	\N	2025-01-07 19:45:01.015072-05	1
b0d9db86-f489-4186-8b22-c470a5a92d5b	99c89eb997d4241e624ac1b934ab361f6633310fdcd7449324604dc9ada74a22	2025-01-07 19:53:20.818086-05	20250108005320_amrapdefault	\N	\N	2025-01-07 19:53:20.815512-05	1
68ee0d6c-27ee-4a3c-85ad-e810c4962781	56cc8f50adb88a931f531b5a782cf3fdf09b37ba61370c4e64ab4d6f5c92a573	2025-01-12 18:41:46.685302-05	20250112234146_int_weights	\N	\N	2025-01-12 18:41:46.675023-05	1
4783f5dc-fff0-4bb0-974e-0f6796e15c17	bdf3c4d08611938230faf8ae8e2f988547fbf713acb1039030e83f0602058d0d	2025-01-07 20:30:42.590666-05	20250108013042_alternate_relationship_switch	\N	\N	2025-01-07 20:30:42.579624-05	1
c6e3e3e4-5657-4672-a979-29e04a8efe84	33481b8d98d78959eab47433c4a25b08635061d25004200b95d39fcdacd0b5d3	2025-01-07 20:38:29.966359-05	20250108013829_rm_unique_name	\N	\N	2025-01-07 20:38:29.960502-05	1
453437e8-e3e9-42ac-8b7f-eff7781caffc	55d8e73e255e0bf1bd57291cb809d68ffe0c7edebe996eac019e8ce100b51ae1	2025-01-17 00:04:31.971794-05	20250117050431_time_fix	\N	\N	2025-01-17 00:04:31.969479-05	1
ae6d92df-8771-49fd-a04d-91a025546470	0bb86b214cc32d1af7bc0cf1a1e94dcde62b6d60ad3289029f0a3fe54da3a508	2025-01-07 20:42:16.424036-05	20250108014216_name_maps	\N	\N	2025-01-07 20:42:16.401311-05	1
254b4a61-1dbf-4740-8d19-7f02aebe372a	13aea2c31d43b6fda178ffdf9ab634a167d932ef8a1dc3611530592d0778ff8a	2025-01-13 01:04:01.455188-05	20250113055606_token_update	\N	\N	2025-01-13 01:04:01.442374-05	1
4891d1ea-8bc7-4a26-a470-9b4660d80d92	3ac8a7c4109e60aaf1f0d3019c2649ee1b0380d43d2e522efc3d6d28f24c6306	2025-01-09 20:20:27.145667-05	20250110012027_truncate_time	\N	\N	2025-01-09 20:20:27.140893-05	1
1b8e9a85-efa2-4040-a2a6-9dba2af73c1b	e8090081547e65b37bdeb036e442b792c54b3ec414e30c59975180a7a41c1d0a	2025-01-13 01:04:01.459044-05	20250113055802_cascade_entries	\N	\N	2025-01-13 01:04:01.455685-05	1
b1877976-d10b-4931-839c-9a25069b426b	49adba728888bf61476579f71955cc229ef4c1bcd6e53037bc002c6167142b16	2025-03-31 20:53:04.906736-04	20250401005304_template_schema	\N	\N	2025-03-31 20:53:04.888816-04	1
368c4f4a-d9a6-4979-bf5b-0b312e7662ed	9ba4e37f7cbfecb4fa894c26b80680bdd71769ef4c9bf9c447d4418541589a4c	2025-01-14 00:42:48.924507-05	20250114031952_prod_db	\N	\N	2025-01-14 00:42:48.920373-05	1
b190481a-a2c3-4529-8116-f227df0d4499	792b4023271a20410a96946dd05894e2527e2cf6b5608e4c0ab1c03f36e4cf2c	2025-01-14 00:42:49.573473-05	20250114054249_add_last_login	\N	\N	2025-01-14 00:42:49.568718-05	1
319603f8-a8d5-4c34-84a5-ce92c9b4a3c6	9ba4e37f7cbfecb4fa894c26b80680bdd71769ef4c9bf9c447d4418541589a4c	2025-01-17 00:01:57.5972-05	20250114084828_added_last_login	\N	\N	2025-01-17 00:01:57.592601-05	1
8204f100-8f6f-4f31-a97c-a0943497af0d	9a9609624dd1197284d3baf871b8d306b9c285ea691bf8d928a3fc765fbad2ea	2025-03-31 21:32:19.189735-04	20250401013219_add_user_workouts	\N	\N	2025-03-31 21:32:19.186133-04	1
0e181d35-6767-4a25-9153-550c33996565	91265720fe4f0ee6b3b73fb2b0e76cebfc1060f43248d9439bbd0df4afb123a5	2025-03-31 21:48:45.689329-04	20250401014845_add_user_preferences	\N	\N	2025-03-31 21:48:45.682427-04	1
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.tokens (id, "userId", token, "createdAt", "expiresAt") FROM stdin;
26	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmNzUyNmRkLTI2M2UtNGQ0MC1iZGFiLTM5NWMwZDFjY2JmNiIsImFkbWluIjpmYWxzZSwidXNlcm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJuYWl5bS5oYXJyaXNAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkZE1rWjdTb2dIUlRXWU1KSlJtd01hZW5maklCNnM3QWptTmRadUJGVTFSdC4ubW5vemdqMUciLCJ2ZXJpZmllZCI6dHJ1ZSwibGFzdExvZ2luIjoiMjAyNS0wMS0xNFQwMDowMDowMC4wMDBaIiwiaWF0IjoxNzM2ODczMjc2fQ.eweJYxSPVEY_8XUMxE1yLqyY2BpVgL0sYP4rsihULnw	2025-01-14 16:47:56.981	2025-01-14 17:47:56.981
27	7f27c0ea-0d8f-4ed7-8308-a744c59efc48	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmMjdjMGVhLTBkOGYtNGVkNy04MzA4LWE3NDRjNTllZmM0OCIsImFkbWluIjpmYWxzZSwidXNlcm5hbWUiOiJuYWl5bSIsImVtYWlsIjoibmFpeW0uaGFycmlzQGljbG91ZC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRqNkpxL0pOdkF6Q2liZ3VZOXJUWTBPTHFrNG1pRmxLV2J2UmdNbDMza241bmwzMXdMdnhLQyIsInZlcmlmaWVkIjpmYWxzZSwibGFzdExvZ2luIjoiMjAyNS0wMS0xNFQwMDowMDowMC4wMDBaIiwiaWF0IjoxNzM2ODc2OTU5fQ.wuJKy9fGlRgON2tUGyxQE-74ufcLVbzE9pYZ-yKPtQc	2025-01-14 17:49:19.029	2025-01-14 18:49:19.028
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.user_preferences (id, "userId", "templateOrder", "createdAt", "updatedAt") FROM stdin;
1	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	\N	2025-04-01 01:54:14.895	2025-04-01 01:54:14.895
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.users (id, admin, username, password, email, verified, "lastLogin") FROM stdin;
7f27c0ea-0d8f-4ed7-8308-a744c59efc48	f	naiym	$2a$10$j6Jq/JNvAzCibguY9rTY0OLqk4miFlKWbvRgMl33kn5nl31wLvxKC	naiym.harris@icloud.com	f	2025-01-14
ccd43ce5-4525-46e0-aeac-a15ab15706d3	f	user	$2a$10$C4Gf/QlxUBgWA4t4FwFbc.gTB4IlkHw6Bd7pGnGW7N0XyTdGTlFZ6	\N	f	2025-01-15
7f7526dd-263e-4d40-bdab-395c0d1ccbf6	f	test	$2a$10$dMkZ7SogHRTWYMJJRmwMaenfjIB6s7AjmNdZuBFU1Rt..mnozgj1G	naiym.harris@gmail.com	t	2025-04-01
\.


--
-- Data for Name: weightentry; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.weightentry (id, "userId", "workoutId", weight, date) FROM stdin;
586	ccd43ce5-4525-46e0-aeac-a15ab15706d3	8	110	2025-01-14
587	ccd43ce5-4525-46e0-aeac-a15ab15706d3	9	115	2025-01-14
620	ccd43ce5-4525-46e0-aeac-a15ab15706d3	4	120	2025-01-15
604	ccd43ce5-4525-46e0-aeac-a15ab15706d3	6	115	2025-01-14
581	ccd43ce5-4525-46e0-aeac-a15ab15706d3	6	90	2025-01-13
16	ccd43ce5-4525-46e0-aeac-a15ab15706d3	11	105	2025-01-10
583	ccd43ce5-4525-46e0-aeac-a15ab15706d3	4	120	2025-01-14
654	ccd43ce5-4525-46e0-aeac-a15ab15706d3	5	140	2025-02-03
18	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	155	2025-01-11
580	ccd43ce5-4525-46e0-aeac-a15ab15706d3	5	115	2025-01-13
579	ccd43ce5-4525-46e0-aeac-a15ab15706d3	4	105	2025-01-13
588	ccd43ce5-4525-46e0-aeac-a15ab15706d3	20	115	2025-01-14
643	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	200	2025-01-17
599	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	100	2025-01-10
655	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	160	2025-02-03
657	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	2	100	2025-03-31
605	ccd43ce5-4525-46e0-aeac-a15ab15706d3	6	80	2025-01-15
607	ccd43ce5-4525-46e0-aeac-a15ab15706d3	11	110	2025-01-11
658	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	4	95	2025-03-31
659	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	5	95	2025-03-31
600	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	100	2025-01-12
660	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	6	110	2025-03-31
661	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	7	100	2025-03-31
609	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	100	2025-01-13
662	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	8	115	2025-03-31
663	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	9	115	2025-03-31
616	ccd43ce5-4525-46e0-aeac-a15ab15706d3	2	100	2025-01-08
\.


--
-- Data for Name: workout; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.workout (id, name, sets, reps, amrap, type, "supersettedId", "alternateId", alt, ss, "isTemplate", "templateId", "workoutId", "isGlobal", "userId") FROM stdin;
11	Deadlifts	5	5	t	pull	\N	10	f	f	f	\N	\N	t	\N
17	Squats	3	5	t	legs	\N	\N	f	f	f	3	\N	t	\N
18	Romanian Deadlift	3	8-12	f	legs	\N	\N	f	f	f	3	\N	t	\N
19	Leg Press	3	8-12	f	legs	\N	\N	f	f	f	3	\N	t	\N
20	Leg Curls	3	8-12	f	legs	\N	\N	f	f	f	3	\N	t	\N
21	Calf Raises	5	8-12	f	legs	\N	\N	f	f	f	3	\N	t	\N
4	Overhead Press	3	8-12	f	push	\N	3	f	f	f	\N	\N	t	\N
8	Overhead Triceps Extensions	3	8-12	f	push	\N	\N	f	f	f	\N	\N	t	\N
3	Bench Press	3	8-12	f	push	\N	\N	f	f	f	1	\N	t	\N
7	Lateral Raises	3	15-20	f	push	6	\N	f	f	f	1	\N	t	\N
2	Bench Press	5	5	t	push	\N	1	f	f	f	1	\N	t	\N
5	Incline Dumbbell Press	3	8-12	f	push	\N	\N	f	f	f	1	\N	t	\N
6	Tricep Pushdowns	3	8-12	f	push	\N	\N	f	f	f	1	\N	t	\N
12	Pulldowns (or Pullups/Chinups)	3	8-12	f	pull	\N	\N	f	f	f	\N	\N	t	\N
13	Chest Supported Rows	3	8-12	f	pull	\N	\N	f	f	f	\N	\N	t	\N
14	Face Pulls	5	15-20	f	pull	\N	\N	f	f	f	\N	\N	t	\N
15	Hammer Curls	4	8-12	f	pull	\N	\N	f	f	f	\N	\N	t	\N
16	Dumbbell Curls	4	8-12	f	pull	\N	\N	f	f	f	\N	\N	t	\N
1	Overhead Press	5	5	t	push	\N	\N	f	f	f	4	\N	t	\N
9	Lateral Raises	3	15-20	f	push	8	\N	f	f	f	4	\N	t	\N
10	Barbell Rows	5	5	t	pull	\N	\N	f	f	f	4	\N	t	\N
22	Test Workout	3	8-12	f	legs	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
23	Test Workout	3	8-12	f	push	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
24	Test Workout	3	8-12	f	legs	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
25	Test Workout	3	8-12	f	push	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
26	Test Workout	3	8-12	f	push	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
27	Test Workout	3	8-12	f	push	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
28	Test Shoulder Press	4	8-12	f	push	\N	\N	f	f	f	\N	\N	f	7f7526dd-263e-4d40-bdab-395c0d1ccbf6
\.


--
-- Data for Name: workout_template; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.workout_template (id, name, description, "userId", "createdAt", "updatedAt") FROM stdin;
3	Leg Day	Legs and core workout	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	2025-04-01 01:04:46.615	2025-04-01 01:04:46.615
1	Push Day A	Chest and triceps focus	7f7526dd-263e-4d40-bdab-395c0d1ccbf6	2025-04-01 01:04:32.264	2025-04-01 01:05:28.41
4	Test Template		7f7526dd-263e-4d40-bdab-395c0d1ccbf6	2025-04-01 01:12:17.486	2025-04-01 01:12:17.486
\.


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.tokens_id_seq', 27, true);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.user_preferences_id_seq', 1, true);


--
-- Name: weightentry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.weightentry_id_seq', 663, true);


--
-- Name: workout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.workout_id_seq', 28, true);


--
-- Name: workout_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.workout_template_id_seq', 4, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weightentry weightentry_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.weightentry
    ADD CONSTRAINT weightentry_pkey PRIMARY KEY (id);


--
-- Name: workout workout_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT workout_pkey PRIMARY KEY (id);


--
-- Name: workout_template workout_template_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout_template
    ADD CONSTRAINT workout_template_pkey PRIMARY KEY (id);


--
-- Name: tokens_userId_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "tokens_userId_key" ON public.tokens USING btree ("userId");


--
-- Name: user_preferences_userId_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "user_preferences_userId_key" ON public.user_preferences USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: workout_alternateId_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "workout_alternateId_key" ON public.workout USING btree ("alternateId");


--
-- Name: workout_supersettedId_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "workout_supersettedId_key" ON public.workout USING btree ("supersettedId");


--
-- Name: tokens tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: weightentry weightentry_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.weightentry
    ADD CONSTRAINT "weightentry_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: weightentry weightentry_workoutId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.weightentry
    ADD CONSTRAINT "weightentry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES public.workout(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workout workout_alternateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "workout_alternateId_fkey" FOREIGN KEY ("alternateId") REFERENCES public.workout(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: workout workout_related_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT workout_related_fkey FOREIGN KEY ("workoutId") REFERENCES public.workout(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: workout workout_supersettedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "workout_supersettedId_fkey" FOREIGN KEY ("supersettedId") REFERENCES public.workout(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: workout workout_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "workout_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public.workout_template(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: workout_template workout_template_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout_template
    ADD CONSTRAINT "workout_template_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workout workout_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "members_only_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: members_only_db; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE members_only_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE members_only_db OWNER TO nharris;

\connect members_only_db

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    author_id integer,
    message character varying,
    "time" timestamp without time zone
);


ALTER TABLE public.messages OWNER TO nharris;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO nharris;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    username character varying,
    password character varying,
    membership_status character varying,
    admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO nharris;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO nharris;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.messages (id, author_id, message, "time") FROM stdin;
4	5	test del\r\n	2024-12-23 00:07:48
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.users (id, first_name, last_name, username, password, membership_status, admin) FROM stdin;
3	naiym	harris	nh	$2a$10$ecqLULaiolMlkSJbbCPjA.pF34CDytzCvOj6qPaTUPAABRFFgDdIG	true	f
5	naiym	harris	nh2	$2a$10$qOhW2X7Ntbs0NuzVhfTE.eQtNKk3EZh6yjdCPxnSW4SGPkEbJ6tp6	false	t
6	naiym	admin	admin	$2a$10$XkfC8dBwm/ir44ccUNd1EeyJUWOeeFP7MI6z92KMC4qhBARIvNe5S	false	t
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.messages_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

--
-- Database "music_odin" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: music_odin; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE music_odin WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE music_odin OWNER TO nharris;

\connect music_odin

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: songs; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.songs (
    id integer NOT NULL,
    name character varying(255),
    artist character varying(255),
    album character varying(355),
    genre character varying(255),
    year numeric,
    date_added timestamp without time zone,
    plays numeric
);


ALTER TABLE public.songs OWNER TO nharris;

--
-- Name: songs_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

ALTER TABLE public.songs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.songs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.songs (id, name, artist, album, genre, year, date_added, plays) FROM stdin;
1	H e r O l d F r i e n d s	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	169
2	N o  C h i l l	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	152
3	Just To Keep You Satisfied (Remastered 2003)	Marvin Gaye	Let's Get It On (Remastered 2003)	R&B/Soul	1973	2024-01-09 19:22:00	129
4	Distractions	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	157
5	No Money	Kings of Leon	Come Around Sundown (Expanded Edition)	Alternative	2010	2023-08-12 12:03:00	292
6	HereIAm	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	129
7	KeepHer (feat. Thundercat)	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	135
8	POINT ME TO IT	Concrete Boys, Lil Yachty & Camo!	It's Us Vol. 1	Hip-Hop/Rap	2024	2024-04-04 23:14:00	130
9	Shadowboxing	Domo Genesis & Evidence	Shadowboxing - Single	Hip-Hop/Rap	2023	2024-04-17 22:14:00	125
10	Jack Frost	Nicholas Craven & Boldy James	Penalty of Leadership	Hip-Hop/Rap	2024	2024-01-12 02:30:00	125
11	Stealth Mode	J. Cole & Bas	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	113
12	The End	Kings of Leon	Come Around Sundown (Expanded Edition)	Alternative	2010	2023-08-12 12:39:00	160
13	Grooviest In the World	Dc2trill	Family Matters	Hip-Hop/Rap	2023	2023-12-05 22:57:00	171
14	Comfortable (feat. Babyface)	Lil Wayne	Tha Carter III	Hip-Hop/Rap	2008	2024-05-24 07:38:00	88
15	No Pun Intended	Nicholas Craven & Boldy James	Penalty of Leadership	Hip-Hop/Rap	2023	2024-01-12 02:30:00	87
16	Distant Lover (Remastered 2003)	Marvin Gaye	Let's Get It On (Remastered 2003)	R&B/Soul	1973	2024-01-11 10:01:00	94
17	Unison	Pinegrove	Everything so Far	Rock	2015	2024-08-17 19:02:00	85
18	Lookin’	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	93
19	Stickz N Stonez	J. Cole	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	88
20	Seen	Kings of Leon	Can We Please Have Fun	Rock	2024	2024-05-10 00:27:00	90
21	MoreOfIt	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	84
22	Battlefield	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	84
23	Pickup Truck	Kings of Leon	Come Around Sundown (Expanded Edition)	Alternative	2010	2024-02-03 12:43:00	75
24	Pi (feat. Daylyt & Ab-Soul)	J. Cole	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	78
25	Huntin’ Wabbitz	J. Cole	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	89
26	Red Leather	Future, Metro Boomin & J. Cole	WE STILL DON'T TRUST YOU	Hip-Hop/Rap	2024	2024-04-11 23:16:00	46
27	Green Room	Ken Carson	A Great Chaos	Hip-Hop/Rap	2023	2023-10-14 23:03:00	74
28	Willing To Trust	Kid Cudi & Ty Dolla $ign	Entergalactic	R&B/Soul	2022	2022-10-14 19:25:00	79
29	Pyro	Kings of Leon	Come Around Sundown (Expanded Edition)	Alternative	2010	2024-02-03 12:07:00	74
30	Where I Go (feat. H.E.R.)	NxWorries & H.E.R.	Why Lawd?	Hip-Hop/Rap	2022	2024-06-11 23:58:00	70
31	T h e  R e t r e a t	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	72
32	86Sentra	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-11 23:58:00	80
33	Trae The Truth in Ibiza	J. Cole	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	55
34	Need 2	Pinegrove	Everything so Far	Rock	2015	2024-08-16 10:51:00	64
35	Gonna Love Me	Teyana Taylor	K.T.S.E.	R&B/Soul	2018	2024-01-13 00:29:00	70
36	The Medium	Navy Blue	Ways of Knowing	Hip-Hop/Rap	2023	2024-01-30 22:07:00	76
37	Tonight	SahBabii	Squidtastic	Hip-Hop/Rap	2018	2024-09-27 06:15:00	75
38	MoveOn	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	72
39	Cartier (feat. Elcamino)	Boldy James	The Versace Tape	Hip-Hop/Rap	2020	2021-09-28 12:23:00	80
40	luther	Kendrick Lamar & SZA	GNX	Hip-Hop/Rap	2024	2024-11-22 13:47:00	76
41	OutTheWay (feat. Rae Khalil)	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	44
42	M a k e  I t  T o  T h e  M o r n i n g	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	47
43	2 The Sky	Robin Thicke	The Evolution of Robin Thicke (Deluxe Edition)	Contemporary R&B	2006	2020-08-02 19:37:00	74
44	Murderous Tendencies	Nicholas Craven & Boldy James	Penalty of Leadership	Hip-Hop/Rap	2024	2024-01-12 02:30:00	66
45	Previouscats	Musiq Soulchild	Juslisen	R&B/Soul	2002	2024-01-10 01:20:00	72
46	Daydreaming	NxWorries	Why Lawd?	Hip-Hop/Rap	2023	2024-06-11 23:58:00	53
47	SheUsed	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	58
48	Onenight	Musiq Soulchild	Juslisen	R&B/Soul	2002	2024-01-10 01:20:00	47
49	The Bucket	Kings of Leon	Aha Shake Heartbreak	Rock	2004	2024-08-25 19:32:00	66
50	This Sunday	Future & Metro Boomin	WE STILL DON'T TRUST YOU	Hip-Hop/Rap	2024	2024-04-11 23:16:00	49
51	NVR.RMX (feat. Charlie Wilson)	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	54
52	Calling For You (feat. 21 Savage)	Drake	For All The Dogs Scary Hours Edition	Hip-Hop/Rap	2023	2023-11-17 00:14:00	57
53	Sweetest Goodbye	Maroon 5	Songs About Jane	Rock	2002	2022-07-01 00:29:00	77
54	OPEN UP	Daniel Caesar	CASE STUDY 01	R&B/Soul	2019	2023-06-06 13:59:00	110
55	Heal the Land	Budgie	Holy Ghost Zone II	Hip-Hop/Rap	2020	2024-01-19 06:46:00	58
56	Asian Rock	LAZER DIM 700	Asian Rock - Single	Hip-Hop/Rap	2024	2024-02-27 20:35:00	58
57	JEFF & LITA	Concrete Boys, Lil Yachty & KARRAHBOOO	It's Us Vol. 1	Hip-Hop/Rap	2024	2024-04-04 23:14:00	52
58	ThankU (feat. Dave Chappelle)	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	58
59	FromHere (feat. Snoop Dogg & October London)	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-11 23:58:00	52
60	Want 2 Love U	Budgie	Holy Ghost Zone	Hip-Hop/Rap	2018	2023-05-05 18:03:00	164
61	For Me	Loe Shimmy	Zombieland 2.6	Hip-Hop/Rap	2024	2024-09-24 23:41:00	39
62	Tried Our Best	Drake	For All The Dogs Scary Hours Edition	Hip-Hop/Rap	2023	2023-11-17 00:14:00	49
63	Heavy On My Heart	LUCKI	2 Faced, Pt. 2 - Single	Hip-Hop/Rap	2024	2024-06-02 00:30:00	26
64	M.O.B.	Concrete Boys & Lil Yachty	It's Us Vol. 1	Hip-Hop/Rap	2024	2024-04-04 23:14:00	53
65	F a m i l y	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	33
66	Hold My Liquor	Kanye West	Yeezus	Hip-Hop/Rap	2013	2021-10-07 20:20:00	42
67	Of Course	DRAM	DRAM&B	R&B/Soul	2024	2024-05-18 21:53:00	44
68	I Get Busy	Dc2trill	I Get Busy / 6 Wolves - Single	Hip-Hop/Rap	2023	2023-12-05 20:14:00	107
69	3001	J. Cole	Might Delete Later	Hip-Hop/Rap	2024	2024-04-04 23:01:00	30
70	The Same	Budgie	Holy Ghost Zone II	Hip-Hop/Rap	2020	2024-01-19 06:46:00	53
71	Grey October (feat. Evidence)	Boldy James & The Alchemist	The Price of Tea in China (Deluxe Edition)	Hip-Hop/Rap	2020	2021-08-14 02:09:00	215
72	Coming Soon / Tied Up	Budgie	Holy Ghost Zone	Hip-Hop/Rap	2018	2023-05-05 18:03:00	142
73	Vantage Point	Sy Ari Da Kid	The Shadow In the Shade 2	Hip-Hop/Rap	2022	2023-07-03 20:56:00	120
74	swag it!	Chow Lee	swag it! - Single	Hip-Hop/Rap	2023	2024-02-23 12:25:00	36
75	FREAK IN YOU	PARTYNEXTDOOR	COLOURS 2 - EP	R&B/Soul	2017	2024-07-15 02:12:00	34
76	Let Me Go	Daniel Caesar	NEVER ENOUGH	R&B/Soul	2023	2023-04-13 21:41:00	145
77	Evil Genius	Nicholas Craven & Boldy James	Penalty of Leadership	Hip-Hop/Rap	2024	2024-01-12 02:30:00	39
78	FallThru	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	44
79	DistantSpace	NxWorries	Why Lawd?	Hip-Hop/Rap	2024	2024-06-13 23:04:00	49
80	Keep My Promise	Budgie	Holy Ghost Zone II	Hip-Hop/Rap	2020	2024-01-19 06:46:00	50
81	Details	The Alchemist & Larry June	The Genuine Articulate	Hip-Hop/Rap	2024	2024-09-19 23:40:00	37
82	The Immortals	Kings of Leon	Come Around Sundown (Expanded Edition)	Alternative	2010	2024-02-03 12:16:00	38
83	By Tomorrow	Hunxho	For Her	Hip-Hop/Rap	2022	2023-10-12 23:27:00	97
84	Thank U	Budgie	Holy Ghost Zone II	Hip-Hop/Rap	2020	2024-01-19 06:46:00	48
85	New Sky (feat. Kadhja Bonet)	SiR	Chasing Summer	R&B/Soul	2019	2023-01-09 02:01:00	194
86	Are You Looking Up	Mk.gee	Two Star & The Dream Police	Alternative	2024	2024-07-10 18:50:00	31
87	Fighting My Demons	Ken Carson	A Great Chaos	Hip-Hop/Rap	2023	2023-10-14 23:03:00	54
88	Disillusioned	Daniel Caesar	NEVER ENOUGH	R&B/Soul	2023	2023-04-13 21:41:00	155
89	Please Do Not Lean (feat. BADBADNOTGOOD)	Daniel Caesar	Please Do Not Lean (feat. BADBADNOTGOOD) - Single	R&B/Soul	2022	2024-07-14 21:37:00	26
91	Just Friends (Sunny)	Musiq	Aijuswanaseing (Special Edition)	R&B/Soul	2000	2024-06-26 11:01:00	31
92	Gangermatic	Veeze	Ganger (Deluxe Edition)	Hip-Hop/Rap	2023	2023-10-12 23:24:00	51
93	Never Alone	Budgie	Holy Ghost Zone	Hip-Hop/Rap	2018	2023-05-05 10:34:00	193
94	Virginia Beach	Drake	For All The Dogs Scary Hours Edition	Hip-Hop/Rap	2023	2023-11-17 00:14:00	43
95	R e a l W o m a n	PARTYNEXTDOOR	PARTYNEXTDOOR 4 (P4)	R&B/Soul	2024	2024-05-10 09:36:00	36
96	Juna	Clairo	Charm	Alternative	2024	2024-10-05 16:42:00	32
97	Can't Shake Her	Kid Cudi & Ty Dolla $ign	Entergalactic	R&B/Soul	2022	2024-02-23 01:19:00	39
98	Weekend	Veeze	Ganger (Deluxe Edition)	Hip-Hop/Rap	2023	2023-10-12 23:24:00	56
99	Trust In God	Budgie	Holy Ghost Zone II	Hip-Hop/Rap	2020	2024-01-19 06:46:00	36
100	Pain Is Inevitable	Daniel Caesar	NEVER ENOUGH	R&B/Soul	2023	2023-04-13 21:41:00	146
90	Wish U Were Here	Jamie Foxx	Unpredictable	R&B/Soul	2005	2021-02-01 23:10:00	41
\.


--
-- Name: songs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.songs_id_seq', 110, true);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

--
-- Database "nharris" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: nharris; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE nharris WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE nharris OWNER TO nharris;

\connect nharris

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

--
-- PostgreSQL database dump complete
--

--
-- Database "odin_blog" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: odin_blog; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE odin_blog WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE odin_blog OWNER TO nharris;

\connect odin_blog

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

--
-- Name: postType; Type: TYPE; Schema: public; Owner: nharris
--

CREATE TYPE public."postType" AS ENUM (
    'post',
    'comment'
);


ALTER TYPE public."postType" OWNER TO nharris;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nharris;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.posts (
    id text NOT NULL,
    "authorId" text,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    publish boolean DEFAULT true NOT NULL,
    "parentId" text,
    type public."postType" DEFAULT 'post'::public."postType" NOT NULL
);


ALTER TABLE public.posts OWNER TO nharris;

--
-- Name: users; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.users (
    id text NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO nharris;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d3b8fd84-2ac0-44c6-9135-a7ee24d0f9d1	b769f05d3a37ccfd7af8aef2580b5e37b0f54470d8aaab5fc519c84945e2e491	2024-12-31 13:35:39.765828-05	20241229225823_init	\N	\N	2024-12-31 13:35:39.750921-05	1
83b96161-ab6b-4f9c-a306-40cc73cb6641	0ec5827260e787f649fbf829081c0e3aeb9e1311dca4f309a75993d7a3d8b514	2024-12-31 13:35:39.77853-05	20241229234947_reinit	\N	\N	2024-12-31 13:35:39.766527-05	1
43faa986-8097-40c5-bf90-673071946367	e754f71f01c13337a0ac33c3966d33bfc44fde766131aee5cc055583443d381a	2024-12-31 13:35:39.786319-05	20241229235215_reinit	\N	\N	2024-12-31 13:35:39.779183-05	1
d85413f4-d3a0-4211-8f76-d5387b02451b	c0ef75e5fba7ac947874a461916e7bb35214d712138de027882ebd7dca8aeece	2024-12-31 13:35:39.792679-05	20241231161258_comment_map	\N	\N	2024-12-31 13:35:39.787196-05	1
3e81ac36-e4c2-47ab-b405-82004b3cb415	6c9ca857af73ce69e8a85df005018dfa1fdaa5a8b00141a96e26068b03afcf30	2024-12-31 13:35:39.794841-05	20241231161533_require_content	\N	\N	2024-12-31 13:35:39.793157-05	1
c69d3b68-8480-4053-98d8-d0acf5bbcc87	6d80fa485da3e41e011807bb97210a1f7bcbc064c1792e28c18c876783140317	2024-12-31 13:35:39.796919-05	20241231161853_publish_name_change	\N	\N	2024-12-31 13:35:39.795332-05	1
04fb3a83-5315-49b4-abc2-67fe605d9105	c442687dd57eda1714fa100f84d8f106db6eb9e0981cdb6e0f2856aad8425d47	2024-12-31 13:35:39.798783-05	20241231164644_publishdefaulttrue	\N	\N	2024-12-31 13:35:39.797347-05	1
1b91720d-548c-45b0-905b-0af88708ae26	5a5df89c2e5728e814a380807e85b441658725c825a75c975645f73af234e079	2024-12-31 13:35:39.802071-05	20241231181925_removed_comment_model	\N	\N	2024-12-31 13:35:39.799182-05	1
27cb8e1d-6ca5-4b92-82ed-cd19ca3cb0ff	637e970e8c745847d5df7944975cbe0ba5cb094b21a38c05248504d1e0feb68a	2024-12-31 13:35:39.803857-05	20241231183007_addtype	\N	\N	2024-12-31 13:35:39.802547-05	1
a979ca0e-914c-44ab-ad9c-b62d855d7493	d8a1c6d8c0153bb82827987508715d65781c4dc8de4e7fc040e6aef500023a2d	2024-12-31 13:35:39.809003-05	20241231183036_addtype	\N	\N	2024-12-31 13:35:39.804415-05	1
2a18cd3e-bd98-4ebd-b4f4-9b57fbae24e5	04180f0498d86464ec58a0cacfbd7b99c204082f6b2d323c1c26c8edde1b72f7	2024-12-31 16:06:34.607498-05	20241231210634_author_option	\N	\N	2024-12-31 16:06:34.601864-05	1
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.posts (id, "authorId", content, "createdAt", "updatedAt", publish, "parentId", type) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.users (id, admin, username, password) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: posts posts_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

--
-- Database "odin_drive" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: odin_drive; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE odin_drive WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE odin_drive OWNER TO nharris;

\connect odin_drive

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

--
-- Name: ContentType; Type: TYPE; Schema: public; Owner: nharris
--

CREATE TYPE public."ContentType" AS ENUM (
    'FILE',
    'DIRECTORY'
);


ALTER TYPE public."ContentType" OWNER TO nharris;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    sid text NOT NULL,
    data text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO nharris;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nharris;

--
-- Name: contents; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.contents (
    id integer NOT NULL,
    title text NOT NULL,
    url text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "parentID" integer,
    type public."ContentType" DEFAULT 'DIRECTORY'::public."ContentType" NOT NULL
);


ALTER TABLE public.contents OWNER TO nharris;

--
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contents_id_seq OWNER TO nharris;

--
-- Name: contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.contents_id_seq OWNED BY public.contents.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "contentsID" integer NOT NULL
);


ALTER TABLE public.users OWNER TO nharris;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO nharris;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: contents id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.contents ALTER COLUMN id SET DEFAULT nextval('public.contents_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public."Session" (id, sid, data, "expiresAt") FROM stdin;
Ak1EFMNU2WnEvvFPFmuSNqO2tRaNd8FV	Ak1EFMNU2WnEvvFPFmuSNqO2tRaNd8FV	{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":4},"contents":{"id":6,"title":"user1/","url":null,"createdAt":"2024-12-27T00:55:10.495Z","parentID":null,"type":"DIRECTORY","children":[]}}	2024-12-28 23:53:48.931
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9ca688b1-972e-4c5c-8327-6e96e01aa723	8f95abf11fc7d6aa0eb702f87b6570d47d4fef240c8086fe1d2965555c6be102	2024-12-24 22:35:20.164387-05	20241225033520_init	\N	\N	2024-12-24 22:35:20.153956-05	1
1ae80ef4-cd89-40c5-9df0-093da43fadaf	2a93b3a1c043ea45b09103c9a0e8c731d1dc3d1cbc4de1747ad8553c0fbe54e2	2024-12-24 22:44:02.957282-05	20241225034402_init	\N	\N	2024-12-24 22:44:02.944441-05	1
d243ed47-1ba9-4ea1-8b8e-e083bfdd5d95	63878895489cbc0467e05379f8887bb9783fd1b74794591ba10599d0f8e0e2e5	2024-12-24 22:46:03.597967-05	20241225034603_users_to_users	\N	\N	2024-12-24 22:46:03.590131-05	1
e6646e78-c4f9-4914-97ee-1959598e0755	a8cfb89243770991294584bb711bd1a0b7daaebe763f3d89c36fa4109f65d171	2024-12-24 23:59:11.14379-05	20241225045911_session_store_addded	\N	\N	2024-12-24 23:59:11.137799-05	1
4d6857cf-341c-462a-afe1-2f175d48d15a	c57916a78a05eede806655b0bc61c4ae188452bbceb31338e8c753890e27760d	2024-12-26 18:44:28.444499-05	20241226234428_contents_added	\N	\N	2024-12-26 18:44:28.432931-05	1
13635cfa-1f3d-4f61-aa37-093ca4eb5b85	b749ac2d30617770f53e2a15a5a8609063ebae162e3bb4a2836b7fc69494bfeb	2024-12-26 18:54:57.46687-05	20241226235457_minor	\N	\N	2024-12-26 18:54:57.46446-05	1
b8b3b708-e23a-4c68-bdc0-b32cf1320bdf	c123d7a2fd71fb9f63d1b8fb5a9c32e177f7cc45b20f1615a99efc5eb06b87e5	2024-12-26 18:55:20.955283-05	20241226235520_minor	\N	\N	2024-12-26 18:55:20.952584-05	1
c9f43a24-b099-4cb2-9261-86e57ec02451	54d366deaa5e35bd6c73bb08d87def6b36be1fdc560e1cdaeaa5e181ea011ef9	2024-12-26 18:55:56.146612-05	20241226235556_minor	\N	\N	2024-12-26 18:55:56.142773-05	1
f8efb69f-279e-4685-baa4-f9c0f8f0b763	169946049234f65bfb6b70df6be3d2a8c06225c2a334dbffe15c83ad5fcdd8c3	2024-12-26 18:57:32.02659-05	20241226235732_minor	\N	\N	2024-12-26 18:57:32.024154-05	1
1eb294df-fa95-4971-add6-c98eab7c6b00	fed5047514c5d5fc89c10641ab68141870b32cbd17aa6489d099967de8692316	2024-12-26 19:22:45.072-05	20241227002245_minor	\N	\N	2024-12-26 19:22:45.064932-05	1
316d4dc0-e1fc-45d3-828e-fb720916d8f2	173bd6befc146e6dfd233e70dedd86e8ad3eba7f241812e9b81565a77918b291	2024-12-26 19:23:21.49279-05	20241227002321_minor	\N	\N	2024-12-26 19:23:21.48822-05	1
96000094-b5dc-423e-afc1-0c4bdfd4433d	169946049234f65bfb6b70df6be3d2a8c06225c2a334dbffe15c83ad5fcdd8c3	2024-12-26 19:29:20.820973-05	20241227002920_minor	\N	\N	2024-12-26 19:29:20.816443-05	1
234b36a9-5fd2-492e-b5f9-5b6c64486205	09e3d2a54539b539325083128c297f6eaa605529817b369826a1ac4a5c386ed5	2024-12-27 00:43:43.835811-05	20241227054343_minor	\N	\N	2024-12-27 00:43:43.831814-05	1
aea768f3-b9cc-4c13-941d-f19a22f9942f	3008e92f9960914c6f01963b3e6be017ffe4bc0f20ab9e7393fcf06138b79e86	2024-12-27 14:07:17.997843-05	20241227190717_cascade_delete	\N	\N	2024-12-27 14:07:17.992773-05	1
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.contents (id, title, url, "createdAt", "parentID", type) FROM stdin;
6	user1	\N	2024-12-27 00:55:10.495	\N	DIRECTORY
8	user2	\N	2024-12-27 02:57:33.104	\N	DIRECTORY
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.users (id, username, password, "contentsID") FROM stdin;
4	user1	$2a$10$jbOGCK1jZXcB0G/giD9hhepsXT0mfkXQCr0InRzYvevp0YiNSEBZ2	6
6	user2	$2a$10$A/EnPazRHYPZmOn30Np9QO0vuNlL3mkxT50fwrsOTpmeMGMzudg46	8
\.


--
-- Name: contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.contents_id_seq', 49, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Session_sid_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "Session_sid_key" ON public."Session" USING btree (sid);


--
-- Name: users_contentsID_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX "users_contentsID_key" ON public.users USING btree ("contentsID");


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: nharris
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: contents contents_parentID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "contents_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_contentsID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_contentsID_fkey" FOREIGN KEY ("contentsID") REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- PostgreSQL database dump complete
--

--
-- Database "top_users" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: top_users; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE top_users WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE top_users OWNER TO nharris;

\connect top_users

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: usernames; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.usernames (
    id integer NOT NULL,
    username character varying(255)
);


ALTER TABLE public.usernames OWNER TO nharris;

--
-- Name: usernames_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

ALTER TABLE public.usernames ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usernames_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: usernames; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.usernames (id, username) FROM stdin;
\.


--
-- Name: usernames_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.usernames_id_seq', 6, true);


--
-- Name: usernames usernames_pkey; Type: CONSTRAINT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.usernames
    ADD CONSTRAINT usernames_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

--
-- Database "waldo_odin" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: waldo_odin; Type: DATABASE; Schema: -; Owner: nharris
--

CREATE DATABASE waldo_odin WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE waldo_odin OWNER TO nharris;

\connect waldo_odin

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.characters (
    id integer NOT NULL,
    character_name text,
    x_coords integer[],
    y_coords integer[]
);


ALTER TABLE public.characters OWNER TO nharris;

--
-- Name: scores; Type: TABLE; Schema: public; Owner: nharris
--

CREATE TABLE public.scores (
    id integer NOT NULL,
    username text,
    "time" integer
);


ALTER TABLE public.scores OWNER TO nharris;

--
-- Name: scores_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scores_id_seq OWNER TO nharris;

--
-- Name: scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.scores_id_seq OWNED BY public.scores.id;


--
-- Name: waldo_table_id_seq; Type: SEQUENCE; Schema: public; Owner: nharris
--

CREATE SEQUENCE public.waldo_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.waldo_table_id_seq OWNER TO nharris;

--
-- Name: waldo_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nharris
--

ALTER SEQUENCE public.waldo_table_id_seq OWNED BY public.characters.id;


--
-- Name: characters id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.characters ALTER COLUMN id SET DEFAULT nextval('public.waldo_table_id_seq'::regclass);


--
-- Name: scores id; Type: DEFAULT; Schema: public; Owner: nharris
--

ALTER TABLE ONLY public.scores ALTER COLUMN id SET DEFAULT nextval('public.scores_id_seq'::regclass);


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.characters (id, character_name, x_coords, y_coords) FROM stdin;
1	plankton	{1306,1324}	{222,248}
2	fry	{880,917}	{1848,1942}
3	spiderman	{1200,1275}	{2965,3030}
\.


--
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: nharris
--

COPY public.scores (id, username, "time") FROM stdin;
10	basednai	2450
11	basednai	2790
12	basednai	2490
15	basednai	2560
13	basednai	3480
\.


--
-- Name: scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.scores_id_seq', 15, true);


--
-- Name: waldo_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nharris
--

SELECT pg_catalog.setval('public.waldo_table_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

