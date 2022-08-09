/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from "react"
import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'
import {pipeWithPromise} from './utils';

function DiscoverBooksScreen() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState([])
  const [queried, setQueried] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    (async () => {
      if (!queried) return;
      try {
        setStatus('loading')
        await pipeWithPromise(
          encodeURIComponent,
          appendURI,
          client,
          setData
        )(query)
        setStatus('success')
      } catch (err) {
        console.error(err)
        setStatus('idle')
        setError(err.message)
      } finally {
        setQueried(false)
      }
    })()
  }, [queried, query]);

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  function handleSearchSubmit(event) {
    event.preventDefault()
    setQuery(event.target.elements.search.value)
    setQueried(true)
  }

  function appendURI(query) {
    return `books?query=${query}`
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
      {error && <p>{error}</p>}
    </div>
  )
}

export {DiscoverBooksScreen}
