import {useQuery, queryCache} from 'react-query'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import {useClient} from '../context/auth-context.exercise';
import * as React from 'react';

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, client) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`).then(data => data.books),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

function useBookSearch(query) {
  const client = useClient()
  const result = useQuery(getBookSearchConfig(query, client))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const client = useClient()
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const client = useClient()
  return React.useCallback(
    async () => {
      queryCache.removeQueries('bookSearch')
      await queryCache.prefetchQuery(getBookSearchConfig('', client))
    }, [client]
  )
}
async function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  await queryCache.prefetchQuery(getBookSearchConfig('', user))
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book, bookQueryConfig)
}

export {
  useBook,
  useBookSearch,
  refetchBookSearchQuery,
  setQueryDataForBook,
  useRefetchBookSearchQuery,
}
