import { type NextPage } from 'next'
import {
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'

import Main from '@/components/design/main'
import Page from '@/components/page'
import DragDropList from '@/components/dragDropList'
import Footer, { FooterListItem } from '@/components/design/footer'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { Note } from '@prisma/client'

type Mode = 'text' | 'list'

const Home: NextPage = () => {
  const { data: note, refetch } = api.notes.get.useQuery()
  // const [text, setText] = useLocalStorage('dlp-plan', '')
  const [mode, setMode] = useLocalStorage<Mode>('dlp-mode', 'text')

  const [body, setBody] = useState<string>((note?.body as string) ?? '')
  useEffect(() => {
    setBody(note?.body as string)
  }, [note])
  const utils = api.useContext()
  const { mutate: updateNote } = api.notes.save.useMutation({
    // https://create.t3.gg/en/usage/trpc#optimistic-updates
    async onMutate(newNote) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.notes.get.cancel()

      // Get the data from the queryCache
      const prevData = utils.notes.get.getData()

      // Optimistically update the data with our new post
      utils.notes.get.setData(undefined, () => newNote as Note)

      // Return the previous data so we can revert if something goes wrong
      return { prevData }
    },
    onError(err, newNote, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.notes.get.setData(undefined, ctx?.prevData)
    },
    async onSettled() {
      // Sync with server once mutation has settled
      await utils.notes.get.invalidate()
    },
  })

  const textAsList = (body ?? '').split('\n')
  return (
    <Page>
      <Main className='flex flex-col p-4'>
        {mode === 'list' ? (
          <div className='space-y-3'>
            <DragDropList
              items={textAsList
                // .filter(item => item)
                .map(item => ({ id: item, item }))}
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
            className='h-full w-full flex-grow bg-cobalt'
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        )}
      </Main>
      <Footer>
        <FooterListItem
          onClick={() => {
            refetch().catch(err => console.log(err))
          }}
        >
          <ArrowPathIcon className='h-6 w-6' />
        </FooterListItem>
        {mode === 'text' ? (
          <FooterListItem onClick={() => setMode('list')}>
            <ListBulletIcon className='h-6 w-6' />
          </FooterListItem>
        ) : (
          <FooterListItem onClick={() => setMode('text')}>
            <PencilSquareIcon className='h-6 w-6' />
          </FooterListItem>
        )}
        <FooterListItem onClick={() => copyToClipboard(body)}>
          <DocumentDuplicateIcon className='h-6 w-6' />
        </FooterListItem>
        <FooterListItem
          onClick={() => {
            if (note) {
              const newNote = {
                ...note,
                text: `${note?.title ?? ''}\n\n${body}`,
                body,
              }
              updateNote(newNote)
            }
          }}
          disabled={body === note?.body}
        >
          <ArrowDownOnSquareIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </Page>
  )
}

export default Home
