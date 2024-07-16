import { unstable_noStore as noStore } from 'next/cache'

import Main from '@/components/design/main'
import Title from '@/components/design/title'
import Note from './_components/Note'
import { getNote } from '@/server/queries'

export default async function Home() {
  noStore()
  const note = await getNote(process.env.DLP_ID!)
  if (!note) {
    return (
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
          <Title>disneyland planner</Title>
        </div>
      </Main>
    )
  }
  return <Note note={note} />
}
