import {queryCache, useQuery} from 'react-query';
import {client} from './api-client.exercise';
import bookPlaceholderSvg from '../assets/book-placeholder.svg';

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

const getBookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
})

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId, user) {
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  return {...result, book: result.data ?? loadingBook}
}

function refetchBookSearchQuery(query = '', user) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(getBookSearchConfig(query, user))
}

export {
  useBookSearch,
  useBook,
  refetchBookSearchQuery,
}