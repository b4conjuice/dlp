import { Suspense } from 'react'

import { Main } from '@/components/ui'
import Note from './note'
import { getNote } from '@/server/db/notes'

export default async function Home() {
  const note = await getNote(Number(process.env.NOTE_ID))
  if (!note) {
    return (
      <>
        <Main className='flex flex-col px-4 pb-4'>
          <div className='flex flex-grow flex-col space-y-4'>
            <p>note does not exist</p>
          </div>
        </Main>
      </>
    )
  }
  return (
    <Suspense>
      <Note note={note} />
    </Suspense>
  )
}
