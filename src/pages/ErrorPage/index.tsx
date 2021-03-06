import * as React from 'react'

// component
import {
  Icon,
} from 'antd'

// style
import * as styles from './index.css'
import classnames from 'classnames'

function ErrorPage({
  message,
  errorStack,
}: IProps) {
  return (
    <div className={classnames('page-container', 'center-align-column-container')}>
      <Icon type="close-circle-o" className={styles.iconError} />
      <h1>{message}</h1>
      <a target="_blank" href="https://github.com/keymesh/keymesh-dapp/issues/new">Report bugs</a>
      {renderErrorStack(errorStack)}
    </div>
  )
}

function renderErrorStack(errorStack?: string): JSX.Element | null {
  if (errorStack == null) {
    return null
  }

  return (
    <details>
      <summary>You can provide those error messages to us</summary>
      <pre>{errorStack}</pre>
    </details>
  )
}

interface IProps {
  message: string
  errorStack?: string
}

export default ErrorPage
