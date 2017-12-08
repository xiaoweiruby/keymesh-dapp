# Keymail 

*Under development.*

Trusted communication web [DApp](https://ethereum.stackexchange.com/questions/383/what-is-a-dapp).

<details>
  <summary>Development progress</summary>

  ## Basic features
  - [x] Account registration
  - [x] Send messages.
  - [x] Receive messages.
  - [x] Multi-account.
  - [x] Session summary, show a slice of latest message.
  - [ ] Continue registration from record. (Allow user left the registration page when record saved)
  - [ ] Delete session(s).
  - [ ] Upload/replace new pre-keys
  - [ ] Send message without waiting last sending complete in same session. (Function is easy to implement, but need to save & show message sending progress.)
  - [ ] Setting pages.

  ## Edge case handling
  - [x] Truncate username when over length.
  - [ ] Interrupt registration process when user switch Ethereum Account.
  - [ ] Including current enviroment (Cryptobox/IndexedDBStore) for messages decryptions. (But what if user change network?)

  ## Enhancements/features
  - [x] Ethereum network/account detect.
  - [ ] Use [Bulma](https://github.com/jgthms/bulma) (CSS framework)
  - [ ] Delete account
  - [ ] Delete (selected) message(s).
  - [ ] Import/export account
  - [ ] Cache loaded session messages. (Be careful for memory usage.) (*IndexedDB seems fast enough.*)
</details>