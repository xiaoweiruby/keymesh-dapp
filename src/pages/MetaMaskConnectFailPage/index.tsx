import * as React from 'react'

// component
import { Icon, Collapse } from 'antd'
const Panel = Collapse.Panel

// style
import * as classes from './index.css'
import composeClass from 'classnames'

import metaMaskLockedScreenshot from './meta-mask-screenshot-locked.png'
import howToSelectNetwork from './how-to-select-network.png'

function MetaMaskConnectFailPage(props: IProps) {
  const { status } = props
  switch (status) {
    case CONNECT_STATUS.NO_METAMASK: {
      return (
        <div className={composeClass('center-align-column-container', 'page-container', 'block')}>
          <Icon type="warning" className={classes.warningIcon} />
          <h2 className={classes.warningText}>
            You need to install
            <a className={classes.metaMaskLink} target="_blank" href="https://metamask.io/">
              MetaMask
            </a>
            before using this app.
          </h2>
        </div>
      )
    }
    case CONNECT_STATUS.LOCKED: {
      return (
        <div className={'page-container'}>
          <div className={composeClass('center-align-column-container', 'block')}>
            <Icon type="lock" className={classes.warningIcon} />
            <h2 className={classes.warningText}>
              Please unlock MetaMask.
            </h2>
          </div>
          <Collapse bordered={false}>
            <Panel
              className={classes.collapsePanel}
              header={<h3>Why is MetaMask locked?</h3>}
              key="unlock-metamask"
            >
              <div className={classes.collapseContent}>
                <p>
                  MetaMask locks your account after a certain period of time
                  automatically. To unlock simply click on the MetaMask
                  extension and type in your password.
                </p>
                <img
                  src={metaMaskLockedScreenshot}
                  alt="Screenshot of locked MetaMask interface"
                  className={classes.screenshot}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
      )
    }
    case CONNECT_STATUS.WRONG_NETWORK: {
      return (
        <div className={'page-container'}>
          <div className={composeClass('center-align-column-container', 'block')}>
            <Icon type="api" className={classes.warningIcon} />
            <h2 className={classes.warningText}>
              Plase switch to Rinkeby Test Network
            </h2>
            <p>You are on the wrong network. The KeyMesh BETA runs on the Rinkeby Test Network</p>
          </div>
          <Collapse bordered={false}>
            <Panel
              className={classes.collapsePanel}
              header={<h3>How to select network?</h3>}
              key="select-network"
            >
              <div className={classes.collapseContent}>
                <p>
                  To switch network simply click on the MetaMask extension.
                </p>
                <img
                  src={howToSelectNetwork}
                  alt="Screenshot of how to select network on MetaMask"
                  className={classes.screenshot}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
      )
    }
    default:
      return null
  }
}

export enum CONNECT_STATUS {
  NO_METAMASK,
  LOCKED,
  WRONG_NETWORK,
}

interface IProps {
  status?: CONNECT_STATUS
}

export default MetaMaskConnectFailPage
