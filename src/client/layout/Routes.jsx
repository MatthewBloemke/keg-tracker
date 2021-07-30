import React from 'react'

const Routes = () => {
    return (
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            <Route path="/" exact={true}>
                <Redirect to="/dashboard"/>
            </Route>
            <Route path="/dashboard" exact={true}>
                <Dashboard/>
            </Route>
        </Switch>
    )
}
