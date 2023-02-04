import { type NextPage } from 'next'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'

import Main from '@/components/design/main'
import Page from '@/components/page'
import DragDropList from '@/components/dragDropList'
import Footer from '@/components/design/footer'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'

type Mode = 'text' | 'list'

const Home: NextPage = () => {
  const [text, setText] = useLocalStorage('dlp-plan', '')
  const [mode, setMode] = useLocalStorage<Mode>('dlp-mode', 'text')

  const textAsList = (text ?? '').split('\n')
  return (
    <Page>
      <Main className='flex flex-col p-4'>
        {mode === 'list' ? (
          <div className='space-y-3'>
            <DragDropList
              items={textAsList.map(item => ({ id: item, item }))}
              renderItem={({ item }: { item: string }, index: number) => (
                <div key={index} className='rounded-lg bg-cobalt p-3'>
                  {index + 1}. {item}
                </div>
              )}
              setItems={newItems => {
                setText(newItems.map(({ item }) => item).join('\n'))
              }}
              listContainerClassName='space-y-3'
            />
          </div>
        ) : (
          <textarea
            className='h-full w-full flex-grow bg-cobalt'
            value={text}
            onChange={e => setText(e.target.value)}
          />
        )}
      </Main>
      <Footer>
        <li className='flex-grow'>
          {mode === 'text' ? (
            <button
              className='flex w-full justify-center py-2'
              type='button'
              onClick={() => setMode('list')}
            >
              <ListBulletIcon className='h-6 w-6' />
            </button>
          ) : (
            <button
              className='flex w-full justify-center py-2'
              type='button'
              onClick={() => setMode('text')}
            >
              <PencilSquareIcon className='h-6 w-6' />
            </button>
          )}
        </li>
        <li className='flex-grow'>
          <button
            className='flex w-full justify-center py-2'
            type='button'
            onClick={() => copyToClipboard(text)}
          >
            <DocumentDuplicateIcon className='h-6 w-6' />
          </button>
        </li>
      </Footer>
    </Page>
  )
}

export default Home
