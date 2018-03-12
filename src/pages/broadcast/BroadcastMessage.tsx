import * as React from 'react'
import {
  Link,
} from 'react-router-dom'

import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react'

import {
  Icon,
} from 'antd'
import HashAvatar from '../../components/HashAvatar'
import UserAddress from '../../components/UserAddress'
import {
  IBroadcastMessage,
  MESSAGE_STATUS,
} from '../../stores/BroadcastMessagesStore'
import { UserCachesStore } from '../../stores/UserCachesStore'
import { UserProofsStateStore } from '../../stores/UserProofsStateStore'

import * as styles from './BroadcastMessage.css'
import { getBroadcastEstimateTime, getBroadcastTime } from '../../utils/time'
import classnames from 'classnames'

import {
  PALTFORM_MODIFIER_CLASSES,
} from '../../stores/SocialProofsStore'

interface IProps {
  message: IBroadcastMessage
  userCachesStore: UserCachesStore
  userProofsStateStore: UserProofsStateStore
  status: MESSAGE_STATUS
}

@observer
export default class BroadcastMessage extends React.Component<IProps> {
  // FIXME: no @observable inside React component
  @observable
  private avatarHash: string = ''
  @observable
  private timeText: string = ''
  private updateTimeTimeout!: number

  public async componentDidMount() {
    const {
      userCachesStore: {
        getAvatarHashByUserAddress,
      },
      userProofsStateStore,
      message: {
        author,
      },
    } = this.props
    const avatarHash = await getAvatarHashByUserAddress(author!)
    this.updateTimeText()
    runInAction(() => {
      this.avatarHash = avatarHash
    })

    if (!userProofsStateStore.isFetchingUserProofs) {
      // fetch proving per 15 mins
      userProofsStateStore.startFetchUserProofs(15 * 60 * 1000)
    }
  }

  public componentWillUnmount() {
    const {
      userProofsStateStore,
    } = this.props
    window.clearTimeout(this.updateTimeTimeout)
    userProofsStateStore.stopFetchUserProofs()
  }

  public render() {
    const { message } = this.props
    const userAddress = message.author!
    const username = this.getUsername()

    return <div className={styles.broadcastMessage}>
      <HashAvatar
        className={styles.avatar}
        shape="circle"
        size="large"
        hash={this.avatarHash}
      />
      <div className={styles.body}>
        <div className={styles.infoWrapper}>
          <Link to={`/profile/${userAddress}`}>
            {this.renderUsername(username)}
            {this.renderPlatformIcons()}
            <UserAddress
              className={classnames(styles.userAddress, {
                [styles.userAddressHasUsername]: username != null,
              })}
              maxLength={username ? 8 : 16}
              userAddress={userAddress}
            />
          </Link>
          <span title={getBroadcastTime(message.timestamp)}>
            {` ${this.timeText}`}
          </span>
        </div>
        <p className={styles.content}>{message.message}</p>
        {this.renderMessageStatus()}
      </div>
    </div>
  }

  private updateTimeText() {
    runInAction(() => {
      this.timeText = getBroadcastEstimateTime(this.props.message.timestamp)
    })

    this.updateTimeTimeout = window.setTimeout(() => this.updateTimeText(), 60 * 1000)
  }

  private getUsername(): string | null {
    const { getValidProofs } = this.props.userProofsStateStore

    const validProofs = getValidProofs()
    if (validProofs.length === 0) {
      return null
    }

    return validProofs[0].socialProofs.username
  }

  private renderUsername(username: string | null) {
    if (username == null) {
      return null
    }

    return <span className={styles.username}>{username}</span>
  }

  private renderPlatformIcons() {
    const { getValidProofs } = this.props.userProofsStateStore
    const validProofs = getValidProofs()

    const platformIcons: JSX.Element[] = []
    for (const validProof of validProofs) {
      const platform = validProof.platform
      platformIcons.push((
        <Icon
          key={platform}
          type={platform}
          className={classnames(styles.socialIcon, PALTFORM_MODIFIER_CLASSES[platform])}
        />
      ))
    }

    return platformIcons
  }

  private renderMessageStatus() {
    const messageStatus = this.props.status
    if (messageStatus === MESSAGE_STATUS.DELIVERED) {
      return null
    }
    return (
      <p className={classnames(styles.status, MESSAGE_MODIFIER_CLASSES[messageStatus])}>
        {MESSAGE_STATUS_STR[messageStatus]}
      </p>
    )
  }
}

const MESSAGE_MODIFIER_CLASSES = Object.freeze({
  [MESSAGE_STATUS.DELIVERING]: styles.delivering,
  [MESSAGE_STATUS.FAILED]: styles.failed,
})

const MESSAGE_STATUS_STR = Object.freeze({
  [MESSAGE_STATUS.DELIVERING]: 'Delivering',
  [MESSAGE_STATUS.FAILED]: 'Failed',
})
