import * as React from 'react'

import './index.css'

interface Iprops {
  foo: 'bar'
}

interface Istate {
  foo: 'bar'
}

class Settings extends React.PureComponent<Iprops, Istate> {
  public render() {
    return <pre>Hello Settings</pre>
  }
}

export default Settings
