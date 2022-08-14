import {queryCache, useMutation, useQuery} from 'react-query';
import {client} from './api-client.exercise';

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

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

function useUpdateListItem(user, options) {
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, {
      method: 'PUT',
      data: updates,
      token: user.token,
    }),
    {...defaultMutationOptions, ...options}
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, {
      method: 'DELETE',
      token: user.token,
    }),
    {...defaultMutationOptions, ...options}
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    (updates) => client('list-items', {
      data: updates,
      token: user.token,
    }),
    {...defaultMutationOptions, ...options}
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}