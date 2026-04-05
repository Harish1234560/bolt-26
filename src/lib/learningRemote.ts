import type { SupabaseClient } from "@supabase/supabase-js";
import type { Course, Topic } from "@/data/courses";
import { courses as initialCourses, topics as initialTopics } from "@/data/courses";

export interface DbCourseRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topic_count: number;
}

export interface DbTopicRow {
  id: string;
  course_id: string;
  order_index: number;
  doc: Topic;
}

export function courseToDb(c: Course): DbCourseRow {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    icon: c.icon,
    color: c.color,
    topic_count: c.topicCount,
  };
}

export function rowToCourse(row: DbCourseRow): Course {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    color: row.color,
    topicCount: row.topic_count,
  };
}

export function rowToTopic(row: DbTopicRow): Topic {
  const d = row.doc;
  return {
    ...d,
    id: row.id,
    courseId: row.course_id,
    order: row.order_index,
  };
}

export function recalcTopicCounts(courses: Course[], topics: Topic[]): Course[] {
  return courses.map((c) => ({
    ...c,
    topicCount: topics.filter((t) => t.courseId === c.id).length,
  }));
}

export async function loadRemoteContent(supabase: SupabaseClient): Promise<{ courses: Course[]; topics: Topic[] }> {
  const [cRes, tRes] = await Promise.all([
    supabase.from("courses").select("*").order("id"),
    supabase.from("topics").select("*").order("order_index"),
  ]);
  if (cRes.error) throw cRes.error;
  if (tRes.error) throw tRes.error;
  const rawCourses = (cRes.data ?? []) as DbCourseRow[];
  const rawTopics = (tRes.data ?? []) as DbTopicRow[];
  let courses = rawCourses.map(rowToCourse);
  const topics = rawTopics.map(rowToTopic);
  courses = recalcTopicCounts(courses, topics);
  return { courses, topics };
}

export async function seedIfEmpty(supabase: SupabaseClient): Promise<void> {
  const { count, error: countError } = await supabase.from("courses").select("*", { count: "exact", head: true });
  if (countError) throw countError;
  if ((count ?? 0) > 0) return;

  const { error: cErr } = await supabase.from("courses").insert(initialCourses.map(courseToDb));
  if (cErr) throw cErr;

  const topicRows = initialTopics.map((t) => ({
    id: t.id,
    course_id: t.courseId,
    order_index: t.order,
    doc: t,
  }));
  const { error: tErr } = await supabase.from("topics").insert(topicRows);
  if (tErr) throw tErr;
}

export async function remoteInsertCourse(supabase: SupabaseClient, course: Course) {
  const { error } = await supabase.from("courses").insert(courseToDb(course));
  if (error) throw error;
}

export async function remoteDeleteCourse(supabase: SupabaseClient, courseId: string) {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw error;
}

export async function remoteInsertTopic(supabase: SupabaseClient, topic: Topic) {
  const { error } = await supabase.from("topics").insert({
    id: topic.id,
    course_id: topic.courseId,
    order_index: topic.order,
    doc: topic,
  });
  if (error) throw error;
}

export async function remoteUpdateTopic(supabase: SupabaseClient, topic: Topic) {
  const { error } = await supabase
    .from("topics")
    .update({
      course_id: topic.courseId,
      order_index: topic.order,
      doc: topic,
    })
    .eq("id", topic.id);
  if (error) throw error;
}

export async function remoteDeleteTopic(supabase: SupabaseClient, topicId: string) {
  const { error } = await supabase.from("topics").delete().eq("id", topicId);
  if (error) throw error;
}
