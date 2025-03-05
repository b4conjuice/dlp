'use server'

import 'server-only'

import { and, eq } from 'drizzle-orm'

import { type Note } from '@/lib/types'
import { db } from '@/server/db'
import { notes } from '@/server/db/schema'

export async function saveNote(note: Note) {
  const { id } = note
  if (!id) {
    throw new Error('something went wrong')
  }

  const newNotes = await db
    .update(notes)
    .set({
      ...note,
    })
    .where(eq(notes.id, id))
    .returning()

  if (!newNotes || newNotes.length < 0) {
    throw new Error('something went wrong')
  }
  const newNote = newNotes[0]
  if (!newNote) {
    throw new Error('something went wrong')
  }
  return newNote.id
}

export async function getNote(id: number) {
  const note = await db.query.notes.findFirst({
    where: (model, { eq }) => and(eq(model.id, id)),
  })

  return note
}
