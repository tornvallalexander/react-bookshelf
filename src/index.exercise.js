import React, {createRoot} from "react-dom/client";
import {Logo} from "./components/logo"

const App = () => {
  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={() => console.log("Login")}>Login</button>
      <button onClick={() => console.log("Register")}>Register</button>
    </div>
  )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)
