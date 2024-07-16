'use client'

import { useState, useEffect } from 'react'
import { type Note } from '@prisma/client'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import { useDebounce } from '@uidotdev/usehooks'
import { toast } from 'react-toastify'

import Main from '@/components/design/main'
import Title from '@/components/design/title'
import Footer, { FooterListItem } from '@/components/design/footer'
import { saveNote } from '@/server/queries'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'
import DragDropList from '@/components/dragDropList'

export default function Note({ note }: { note: Note }) {
  const [mode, setMode] = useLocalStorage<'text' | 'list'>('dlp-mode', 'text')
  const [body, setBody] = useState(note.body)
  const debouncedBody = useDebounce(body, 500)

  useEffect(() => {
    async function updateNote() {
      const newNote = {
        ...note,
        text: `${note?.title ?? ''}\n\n${body}`,
        body,
      }
      await saveNote(newNote)
    }
    void updateNote()
  }, [debouncedBody])

  const textAsList = (body ?? '').split('\n')
  return (
    <>
      <Main className='flex flex-col space-y-4 p-4'>
        <Title>disneyland planner</Title>
        {mode === 'list' ? (
          <div className='space-y-3'>
            <DragDropList
              items={textAsList
                // .filter(item => item)
                .map((item, index) => ({ id: `${item}-${index}`, item }))}
              renderItem={({ item }: { item: string }, index: number) => (
                <div key={index} className='rounded-lg bg-cobalt p-3'>
                  {index + 1}. {item}
                </div>
              )}
              setItems={newItems => {
                setBody(newItems.map(({ item }) => item).join('\n'))
              }}
              listContainerClassName='space-y-3'
            />
          </div>
        ) : (
          <textarea
            className='h-full w-full flex-grow bg-cobalt disabled:border-none disabled:opacity-75'
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        )}
      </Main>
      <Footer>
        {mode === 'text' ? (
          <FooterListItem onClick={() => setMode('list')}>
            <ListBulletIcon className='h-6 w-6' />
          </FooterListItem>
        ) : (
          <FooterListItem onClick={() => setMode('text')}>
            <PencilSquareIcon className='h-6 w-6' />
          </FooterListItem>
        )}
        <FooterListItem
          onClick={() => {
            copyToClipboard(body)
            toast.success('copied to clipboard')
          }}
        >
          <DocumentDuplicateIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </>
  )
}
