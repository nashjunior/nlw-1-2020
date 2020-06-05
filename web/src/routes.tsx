import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/home/index';
import CreatePoint from './pages/CreatePoint/index';
const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact/>
      <Route component={CreatePoint} path="/create-point" exact />
    </BrowserRouter>
  )
}

export default Routes;