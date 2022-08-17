import {formatDate} from '../misc';

test('formatDate formats the date to look nice', () => {
  const formatted = formatDate(new Date('October 18, 1988'))
  expect(formatted).toBe('Oct 88')
})

