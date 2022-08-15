// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import {Dialog} from './lib'
import * as React from 'react';

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
    onClick: () => setIsOpen(false)
  })
}

function ModalOpenButton({children: child}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(child, {
    onClick: () => setIsOpen(true)
  })
}

function ModalContents(props) {
  const {isOpen, setIsOpen} = useModal()
  return <Dialog
    isOpen={isOpen}
    onDismiss={() => setIsOpen(false)}
    {...props}
  />
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
}

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitly shared state, so...
// 🐨 create a ModalContext here with React.createContext

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function

// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true

// 🐨 create a ModalContents component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).

// 🐨 don't forget to export all the components here
