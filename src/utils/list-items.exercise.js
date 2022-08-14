import {queryCache, useMutation, useQuery} from 'react-query';
import {client} from './api-client.exercise';

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token: user.token}).then(data => data.listItems)
  })
  return listItems ?? []
}

function useListItem(book, user) {
  const listItems = useListItems(user)
  return listItems.find(item => item.bookId === book.id) ?? null
}


function useUpdateListItem(user) {
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, {
      method: 'PUT',
      data: updates,
      token: user.token,
    }), {
      onSettled: () => queryCache.invalidateQueries('list-items')
    }
  )
}

function useRemoveListItem(user) {
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, {
      method: 'DELETE',
      token: user.token,
    }),
    {
      onSettled: () => void queryCache.invalidateQueries('list-items'),
    }
  )
}

function useCreateListItem(user) {
  return useMutation(
    (updates) => client('list-items', {
      data: updates,
      token: user.token,
    }),
    {
      onSettled: () => void queryCache.invalidateQueries('list-items'),
    }
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}