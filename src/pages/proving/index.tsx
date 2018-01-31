import * as React from 'react'

import { inject, observer } from 'mobx-react'

import {
  Link,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom'

import CommonHeaderPage from '../../containers/CommonHeaderPage'

import { Icon } from 'antd'
import {
  SOCIAL_MEDIA_PLATFORMS,
} from '../../constants'

import ProvingState from './ProvingState'

import GithubProving from './github/index'
import TwitterProving from './twitter/index'
import FacebookProving from './facebook/index'

import { GithubProvingState } from './github/GithubProvingState'
import { TwitterProvingState } from './twitter/TwitterProvingState'
import { FacebookProvingState } from './facebook/FacebookProvingState'
import {
  Istores,
  UsersStore,
  ContractStore,
  EthereumStore,
} from '../../stores'

interface Iparams {
  platform: string
}
interface Iprops extends RouteComponentProps<Iparams> {
  usersStore: UsersStore
  contractStore: ContractStore
  ethereumStore: EthereumStore
}

@inject(({
  usersStore,
  contractStore,
  ethereumStore,
}: Istores) => ({
  usersStore,
  contractStore,
  ethereumStore,
}))

@observer
class Proving extends React.Component<Iprops> {
  public data: ProvingState

  constructor(props: Iprops) {
    super(props)

    const platform = props.match.params.platform
    const isValidPlatform = Object.values(SOCIAL_MEDIA_PLATFORMS).includes(platform)
    this.isValidPlatform = isValidPlatform
    if (isValidPlatform) {
      this.data = this.getSocialProvingState(platform as SOCIAL_MEDIA_PLATFORMS)
    }
  }

  private isValidPlatform: boolean = false

  public render() {
    const {
      hasUser,
    } = this.props.usersStore
    if (!hasUser) {
      return <CommonHeaderPage>
        <Link to="/">Back to index</Link>
      </CommonHeaderPage>
    }

    if (!this.isValidPlatform) {
      return <CommonHeaderPage>
        <p>Invalid platform</p>
        <Link to="/profile">Back to profile</Link>
      </CommonHeaderPage>
    }

    const {
      isFinished,
      platform,
    } = this.data

    let provingComponent
    if (platform === SOCIAL_MEDIA_PLATFORMS.GITHUB) {
      provingComponent = <GithubProving state={this.data as GithubProvingState}/>
    } else if (platform === SOCIAL_MEDIA_PLATFORMS.TWITTER) {
      provingComponent = <TwitterProving state={this.data as TwitterProvingState}/>
    } else if (platform === SOCIAL_MEDIA_PLATFORMS.FACEBOOK) {
      provingComponent = <FacebookProving state={this.data as FacebookProvingState}/>
    }

    if (isFinished) {
      return <Redirect to="/profile" />
    }
    return <CommonHeaderPage>
      <div style={{marginBottom: '8px'}}>
        <Icon type={platform} style={{fontSize: 60}}/>
        {provingComponent}
      </div>
    </CommonHeaderPage>
  }

  private getSocialProvingState(platform: SOCIAL_MEDIA_PLATFORMS): ProvingState {
    switch (platform) {
      case SOCIAL_MEDIA_PLATFORMS.GITHUB:
        return new GithubProvingState(this.props.usersStore)
      case SOCIAL_MEDIA_PLATFORMS.TWITTER:
        return new TwitterProvingState(this.props.usersStore)
      case SOCIAL_MEDIA_PLATFORMS.FACEBOOK:
        return new FacebookProvingState(this.props.usersStore)
      default:
        throw new Error('unknown platform')
    }
  }
}

export default Proving
