import React from "react"
import {Route, Switch} from "react-router-dom"
import Login from "./login/Login"
function App() {
  return (
    <Switch>
      <Route path="/">
        <Login/>
      </Route>
    </Switch>
  );
}

export default App;
