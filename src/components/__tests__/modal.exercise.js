import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

test('can be opened and closed', async () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal Content'

  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>,
  )
  await userEvent.click(screen.getByRole('button', {name: /open/i}))

  const modal = screen.getByRole('dialog')
  const inModal = within(modal)
  expect(modal).toHaveAttribute('aria-label', label)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
// 💰 Remember all userEvent utils are async, so you need to await them.
