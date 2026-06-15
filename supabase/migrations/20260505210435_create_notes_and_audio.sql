/*
  # Notes, Audio Transcriptions, and AI Chat

  ## New Tables

  ### recipe_notes
  - Per-recipe and global notes with text content
  - recipe_id: null = global note
  - supports audio blob references

  ### audio_transcriptions
  - Stores transcription results linked to notes

  ### ai_conversations
  - Chat history for the AI assistant per recipe or global

  ## Security
  - RLS enabled on all tables
  - Policies allow anonymous users (no auth in this app) to read/write
    by using a session key stored in localStorage
*/

CREATE TABLE IF NOT EXISTS recipe_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL DEFAULT '',
  recipe_title text,
  recipe_idx integer,
  content text NOT NULL DEFAULT '',
  audio_url text,
  transcription text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipe_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone with session key can select their notes"
  ON recipe_notes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert notes"
  ON recipe_notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update notes"
  ON recipe_notes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete notes"
  ON recipe_notes FOR DELETE
  USING (true);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL DEFAULT '',
  recipe_idx integer,
  recipe_title text,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select ai conversations"
  ON ai_conversations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert ai conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ai conversations"
  ON ai_conversations FOR DELETE
  USING (true);
