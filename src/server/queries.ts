'use server'

import { prisma as db } from './db'

export async function getNote(id: string) {
  try {
    const note = await db.note.findFirstOrThrow({
      where: {
        id,
      },
    })
    return note
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function saveNote(note: {
  id?: string
  text?: string
  title?: string
  body?: string
  author: string
}) {
  const text = note.text ?? 'untitled\nbody'
  const title = note.title ?? 'untitled'

  const newNote = {
    text,
    title,
    body: note.body ?? 'body',
    author: note.author,
  }

  try {
    return await db.note.upsert({
      where: {
        id: note.id ?? '',
      },
      update: newNote,
      create: newNote,
    })
  } catch (error) {
    console.log(error)
  }
}
