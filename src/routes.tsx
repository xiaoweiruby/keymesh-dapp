import * as React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Home from './pages/home'
import Register from './pages/register'
import Settings from './pages/settings'
import CheckRegister from './pages/check-register'
import NetworkSettings from './pages/network-settings'
import UploadPreKeys from './pages/upload-pre-keys'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/:networkId" component={NetworkSettings} />
      <Route path="/check-register/:networkId?" component={CheckRegister} />
      <Route path="/upload-pre-keys" component={UploadPreKeys} />
    </Switch>
  </Router>
)

export default App
