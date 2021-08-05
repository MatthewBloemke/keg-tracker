import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import {render} from "react-dom";
import App from "./App";
import {BrowserRouter as Router} from 'react-router-dom'

render(<Router>
        <App/>
    </Router>, 
    document.getElementById("app")
)