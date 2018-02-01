import { runInAction, observable } from 'mobx'
import { noop } from '../utils/'
import { IsendingLifecycle } from './SessionStore'
import { UsersStore } from './UsersStore'
import { utf8ToHex, hexToUtf8, sodiumFromHex } from '../utils/hex'
import { BlockType } from 'trustbase/typings/web3'
import { keys } from 'wire-webapp-proteus'
import { storeLogger } from '../utils/loggers'
import { ContractStore } from './ContractStore'

export class BroadcastMessagesStore {
  @observable.ref public broadcastMessages: IreceviedBroadcastMessage[] = []

  constructor({
    usersStore,
    contractStore,
  }: {
    usersStore: UsersStore
    contractStore: ContractStore
  }) {
    this.usersStore = usersStore
    this.contractStore = contractStore
  }

  private usersStore: UsersStore
  private contractStore: ContractStore

  private fetchTimeout: number
  private isFetching: boolean
  private lastFetchBlock: BlockType
  private broadcastMessagesSignatures: string[] = []
  private cachedUserPublicKeys: {
    [userAddress: string]: keys.PublicKey
  } = {}

  public publishBoradcastMessage = (
    message: string,
    {
      transactionWillCreate = noop,
      transactionDidCreate = noop,
      sendingDidComplete = noop,
      sendingDidFail = noop
    }: IsendingLifecycle = {},
  ) => {
    const {
      hasUser,
      currentUserStore,
    } = this.usersStore
    if (!hasUser) {
      return
    }

    const signature = currentUserStore!.sign(message)
    const timestamp = Math.floor(Date.now() / 1000)
    const signedMessage: IsignedBroadcastMessage = {
        message,
        signature,
        timestamp,
    }
    const signedMessageHex = utf8ToHex(JSON.stringify(signedMessage))
    const contract = this.contractStore.broadcastMessagesContract
    contract.publish(signedMessageHex, currentUserStore!.user.userAddress)
      .on('transactionHash', async (hash) => {
        transactionDidCreate(hash)
      })
      .on('confirmation', async (confirmationNumber, receipt) => {
        if (confirmationNumber === Number(process.env.REACT_APP_CONFIRMATION_NUMBER)) {
          if (!receipt.events) {
            sendingDidFail(new Error('Unknown error'))
            return
          }
          sendingDidComplete()
        }
      })
      .on('error', async (error: Error) => {
        sendingDidFail(error)
      })
  }

  public stopFetchBroadcastMessages = () => {
    runInAction(() => {
      this.isFetching = false
      window.clearTimeout(this.fetchTimeout)
    })
  }

  public startFetchBroadcastMessages = async () => {
    if (this.isFetching) {
      return
    }
    const fetNewBroadcastMessagesLoop = async () => {
      try {
        await this.fetchNewBroadcastMessages()
      } finally {
        runInAction(() => {
          this.fetchTimeout = window.setTimeout(
            fetNewBroadcastMessagesLoop,
            FETCH_BROADCAST_MESSAGES_INTERVAL)
        })
      }
    }

    runInAction(() => {
      this.isFetching = true
      this.fetchTimeout = window.setTimeout(fetNewBroadcastMessagesLoop, 0)
    })
  }

  private async getUserPublicKey(userAddress: string) {
    const publicKey = this.cachedUserPublicKeys[userAddress]
    if (publicKey) {
      return publicKey
    }

    const userPublicKey = await this.usersStore.getUserPublicKey(userAddress)
    if (typeof userPublicKey !== 'undefined') {
      this.cachedUserPublicKeys[userAddress] = userPublicKey
    }
    return userPublicKey
  }
  private fetchNewBroadcastMessages = async () => {
    const {
      lastBlock,
      broadcastMessages
    } = await this.contractStore.broadcastMessagesContract.getBroadcastMessages({
      fromBlock: this.lastFetchBlock > 0 ? this.lastFetchBlock : 0
    })

    let messages = (await Promise.all(broadcastMessages.map(async (message: any) => {
      const userAddress = message.userAddress
      const blockTimestamp = message.timestamp
      const signedMessage = JSON.parse(hexToUtf8(message.signedMessage.slice(2))) as IsignedBroadcastMessage
      if (this.broadcastMessagesSignatures.includes(signedMessage.signature)) {
        return null
      }

      this.broadcastMessagesSignatures.push(signedMessage.signature)

      const userPublicKey = await this.getUserPublicKey(userAddress)
      if (typeof userPublicKey === 'undefined') {
        return null
      }

      if (!userPublicKey.verify(sodiumFromHex(signedMessage.signature.slice(2)), signedMessage.message)) {
        storeLogger.error(new Error('invalid signature'))
        return null
      }

      const isInvalidTimestamp = Math.abs(signedMessage.timestamp - blockTimestamp) >= 10 * 60

      const m = {
        message: signedMessage.message,
        timestamp: Number(signedMessage.timestamp) * 1000,
        author: userAddress,
        isInvalidTimestamp,
      } as IreceviedBroadcastMessage
      if (isInvalidTimestamp) {
        m.blockTimestamp = Number(blockTimestamp) * 1000
      }
      return m
    }))).filter((m) => m !== null) as IreceviedBroadcastMessage[]

    if (messages.length > 0) {
      runInAction(() => {
        this.broadcastMessages = this.broadcastMessages.concat(messages)
      })
    }

    this.lastFetchBlock = lastBlock
  }
}

export interface IbroadcastMessage {
  message: string
  timestamp: number
}

export interface IsignedBroadcastMessage extends IbroadcastMessage {
  signature: string
}

export interface IreceviedBroadcastMessage extends IsignedBroadcastMessage {
  author: string
  isInvalidTimestamp: boolean
  blockTimestamp?: number // if isInvalidTimestamp is true, it will be filled
}

const FETCH_BROADCAST_MESSAGES_INTERVAL = 10000