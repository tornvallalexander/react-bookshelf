/** @jsx jsx */
import {jsx} from '@emotion/core'

import {CircleButton, Dialog} from './lib'
import * as React from 'react';
import VisuallyHidden from '@reach/visually-hidden';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const ModalContext = React.createContext()

function useModal() {
  const ctx = React.useContext(ModalContext)
  if (ctx === undefined) {
    throw new Error('useModal should only be used within a ModalContext provider')
  }
  return ctx
}

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  return <ModalContext.Provider value={{isOpen, setIsOpen}} {...props} />
}

function ModalDismissButton({children: child}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick)
  })
}

function ModalOpenButton({children: child}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick)
  })
}

function ModalContentsBase(props) {
  const {isOpen, setIsOpen} = useModal()
  return <Dialog
    isOpen={isOpen}
    onDismiss={() => setIsOpen(false)}
    {...props}
  />
}

function ModalContents({title, children, ...props}) {
  return <ModalContentsBase {...props}>
    <div css={{ display: 'flex', justifyContent: 'flex-end'}}>
      <ModalDismissButton>
        <CircleButton>
          <VisuallyHidden>
            Close
          </VisuallyHidden>
          <span aria-hidden>*</span>
        </CircleButton>
      </ModalDismissButton>
    </div>
    <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
    {children}
  </ModalContentsBase>
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
  ModalContentsBase,
}
