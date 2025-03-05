import { useState } from 'react'
import classNames from 'classnames'
import partition from 'lodash/partition'
import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/20/solid'

import DragDropList from '@/components/drop-drop-list'

const LIST_TYPES = ['reorder', 'select'] as const
type ListType = (typeof LIST_TYPES)[number]

function ReorderList({
  items,
  setItems,
}: {
  items: string[]
  setItems: (items: string[]) => void
}) {
  return (
    <DragDropList
      items={items.map((item, index) => ({ id: `${item}-${index}`, item }))}
      renderItem={({ item }: { item: string }, index: number) => (
        <div
          key={index}
          className='rounded-lg border border-cobalt bg-cobalt p-3'
        >
          {index + 1}. {item}
        </div>
      )}
      setItems={(newItems: Array<{ item: string }>) => {
        setItems(newItems.map(({ item }) => item))
      }}
      listContainerClassName='grow space-y-3 px-2'
    />
  )
}

function SelectList({
  items,
  selectedItems,
  setSelectedItems,
}: {
  items: string[]
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
}) {
  return (
    <ul className='grow space-y-3 px-2'>
      {items.map((item, index) => (
        <li key={index}>
          <label
            className={classNames(
              'flex items-center rounded-lg border border-cobalt bg-cobalt p-3',
              selectedItems.some(i => i === item)
                ? 'border-cb-light-blue'
                : 'border-cobalt'
            )}
          >
            <span className='grow'>
              {index + 1}. {item}
            </span>
            <input
              type='checkbox'
              onChange={() => {
                const newSelectedItems = [...selectedItems]
                const idx = newSelectedItems.findIndex(i => i === item)
                if (idx === -1) {
                  newSelectedItems.push(item)
                } else {
                  newSelectedItems.splice(idx, 1)
                }
                setSelectedItems(newSelectedItems)
              }}
              checked={selectedItems.some(i => i === item)}
            />
          </label>
        </li>
      ))}
    </ul>
  )
}

export default function List(props: {
  items: string[]
  setItems: (items: string[]) => void
}) {
  const { items, setItems } = props
  const [listType, setListType] = useState<ListType>('reorder')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  return (
    <>
      {listType === 'select' ? (
        <SelectList
          {...props}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : (
        <ReorderList {...props} />
      )}
      {listType === 'select' && (
        <footer className='sticky bottom-0 flex items-center justify-center bg-cb-dusty-blue p-2'>
          <div className='flex space-x-4'>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none'
              type='button'
              onClick={() => {
                const [selected, notSelected] = partition(items, item =>
                  selectedItems.some(selectedItem => selectedItem === item)
                )
                const newItems = [...selected, ...notSelected]
                setItems(newItems)
                setSelectedItems([])
              }}
            >
              <ArrowUpIcon className='h-6 w-6' />
            </button>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none'
              type='button'
              onClick={() => {
                const [selected, notSelected] = partition(items, item =>
                  selectedItems.some(selectedItem => selectedItem === item)
                )
                const newItems = [...notSelected, ...selected]
                setItems(newItems)
                setSelectedItems([])
              }}
            >
              <ArrowDownIcon className='h-6 w-6' />
            </button>
          </div>
        </footer>
      )}
      <footer className='sticky bottom-0 flex items-center justify-center bg-cb-dusty-blue p-2'>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setListType('reorder')
            }}
            disabled={listType === 'reorder'}
          >
            <ArrowsUpDownIcon className='h-6 w-6' />
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setListType('select')
            }}
            disabled={listType === 'select'}
          >
            <CheckCircleIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
    </>
  )
}
