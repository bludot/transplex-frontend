import React, {useState, Fragment} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import useSWR from 'swr'
import useDebounce from "./useDebounce";

interface ISearch<T> {
  searchFunction: (query: string) => Promise<T[]>
  mapFunction: (selectItem: (item: T) => void) => (item: T) => JSX.Element
  parseSearchResult: (result: T) => string
  className?: string
}

function Search<T>({searchFunction, mapFunction, parseSearchResult, className}: ISearch<T>) {
  const [selectedItem, setSelectedItem] = useState<T>({
    name: '',
  } as T)
  const [query, setQuery] = useState('')
  const debouncedSearch = useDebounce(query, 300);
  const {data: items, error} = useSWR(() => debouncedSearch || null, searchFunction)


  return (
    <div className={className}>
      <Combobox value={selectedItem} onChange={setSelectedItem}>
        <div className="relative mt-1">
          <div
            className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input onChange={(event) => setQuery(event.target.value)}
                            displayValue={parseSearchResult}
                            className="w-full border-none py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0"
            />
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items?.map((item: T, index: number) => (
                <Combobox.Option
                  key={index}
                  value={item}
                  className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                >
                  {mapFunction(setSelectedItem)(item)}
                </Combobox.Option>))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default Search