import {useQuery} from 'react-query';
import {client} from './api-client.exercise';

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token: user.token}).then(data => data.listItems)
  })
  return listItems ?? []
}

function useListItem(book, user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token: user.token}).then(data => data.listItems)
  })
  return listItems?.find(item => item.bookId === book.id) ?? null
}

export {
  useListItems,
  useListItem,
}