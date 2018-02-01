import * as React from 'react'
import { BroadcastMessagesStore } from '../../stores/BroadcastMessagesStore'
import { storeLogger } from '../../utils/loggers'
interface Iprops {
  broadcastMessagesStore: BroadcastMessagesStore
}

interface Istate {
  message: string
}

export class BroadcastForm extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props)

    this.state = {
      message: ''
    }
  }

  public handlePublish = () => {
    this.props.broadcastMessagesStore.publishBoradcastMessage(this.state.message, {
      transactionDidCreate: () => {
        this.setState({message: ''})
      },
      sendingDidComplete: () => {
        storeLogger.log('completed')
      },
      sendingDidFail: (err: Error) => {
        storeLogger.error(err)
      }
    })
  }

  public handleChange = (event: any) => {
    this.setState({message: event.target.value})
  }

  public render() {
    return <div>
      <textarea value={this.state.message} onChange={this.handleChange} />
      <button onClick={this.handlePublish}>Publish</button>
    </div>
  }
}
