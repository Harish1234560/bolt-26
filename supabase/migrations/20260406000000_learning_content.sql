-- Courses and topics for Code Canvas (synced to all clients via Supabase Realtime).
-- Run via Supabase CLI or paste into SQL Editor after creating a project.

CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  topic_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  doc JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS topics_course_id_idx ON public.topics (course_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Open policies for anon key (replace with auth-scoped policies for production).
CREATE POLICY "courses_select" ON public.courses FOR SELECT USING (true);
CREATE POLICY "courses_insert" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "courses_update" ON public.courses FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "courses_delete" ON public.courses FOR DELETE USING (true);

CREATE POLICY "topics_select" ON public.topics FOR SELECT USING (true);
CREATE POLICY "topics_insert" ON public.topics FOR INSERT WITH CHECK (true);
CREATE POLICY "topics_update" ON public.topics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "topics_delete" ON public.topics FOR DELETE USING (true);

-- Realtime: broadcast row changes to subscribed clients.
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.topics;
