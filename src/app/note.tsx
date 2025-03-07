'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
  ShareIcon,
} from '@heroicons/react/20/solid'
import { useDebounce } from '@uidotdev/usehooks'

import Textarea from '@/components/textarea'
import { type Note } from '@/lib/types'
import { saveNote } from '@/server/db/notes'
import { Main } from '@/components/ui'
import copyToClipboard from '@/lib/copyToClipboard'
import List from './list'
import useTextarea from '@/lib/useTextarea'

const TABS = ['default', 'settings', 'list', 'tools', 'share'] as const
type Tab = (typeof TABS)[number]

export default function Note({ note }: { note: Note }) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as Tab
  const [tab, setTab] = useState<Tab | null>(initialTab ?? 'default')
  // const { isSignedIn } = useAuth()
  const isSignedIn = true
  const {
    textAreaRef,
    text,
    setText,
    currentSelectionStart,
    setCurrentSelectionStart,
    currentSelectionEnd,
    setCurrentSelectionEnd,
    readOnly,
  } = useTextarea({ initialText: note.text })

  const hasChanges = text !== (note.text ?? '')
  const canSave = !readOnly && !(!hasChanges || text === '')

  const debouncedText = useDebounce(text, 500)

  useEffect(() => {
    async function updateNote() {
      if (note) {
        const [title, ...body] = text.split('\n\n')
        const newNote = {
          ...note,
          id: note.id,
          text,
          title: title ?? '',
          body: body.join('\n\n'),
        }

        await saveNote(newNote)
      }
    }
    if (isSignedIn && canSave) {
      void updateNote()
    }
  }, [debouncedText])

  const [title, _, ...items] = text.split('\n')
  const url = `${window.location.origin}${window.location.pathname}`
  return (
    <>
      <Main className='flex flex-col'>
        {tab === 'share' ? (
          <>
            <div className='relative'>
              <div className='absolute right-2 top-2'>
                <button
                  className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
                  type='submit'
                  onClick={() => {
                    copyToClipboard(text)
                  }}
                >
                  <DocumentDuplicateIcon className='h-6 w-6' />
                </button>
              </div>
            </div>
            <textarea
              value={text}
              className='h-full w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cobalt focus:ring-0'
              readOnly
            />
            <h2 className='px-2'>url</h2>
            <button
              className='flex w-full items-center justify-between border-cobalt bg-cobalt px-2 py-3 text-left text-cb-yellow hover:cursor-pointer hover:text-cb-yellow/75'
              onClick={() => {
                copyToClipboard(url)
              }}
            >
              <span>{url}</span>
              <DocumentDuplicateIcon className='h-6 w-6' />
            </button>
          </>
        ) : tab === 'list' ? (
          <>
            <h2 className='px-2'>{title}</h2>
            <List
              items={items}
              setItems={(newItems: string[]) => {
                setText(`${title}\n\n${newItems.join('\n')}`)
              }}
            />
          </>
        ) : (
          <Textarea
            textAreaRef={textAreaRef}
            text={text}
            setText={setText}
            currentSelectionStart={currentSelectionStart}
            setCurrentSelectionStart={setCurrentSelectionStart}
            currentSelectionEnd={currentSelectionEnd}
            setCurrentSelectionEnd={setCurrentSelectionEnd}
            textareaProps={{
              readOnly,
            }}
          />
        )}
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-4 pt-2'>
        <div className='flex space-x-4'></div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('share')
            }}
            disabled={tab === 'share'}
          >
            <ShareIcon className='h-6 w-6' />
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('list')
            }}
            disabled={tab === 'list'}
          >
            <ListBulletIcon className='h-6 w-6' />
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('default')
            }}
            disabled={tab === 'default'}
          >
            <PencilSquareIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
    </>
  )
}
