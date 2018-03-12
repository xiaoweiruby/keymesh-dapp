const DEV_OAUTH_API_PREFIX =
  'https://lhql95dprb.execute-api.ap-northeast-1.amazonaws.com/Stage'

const BETA_OAUTH_API_PREFIX =
  'https://7kkvzvs5p7.execute-api.us-west-1.amazonaws.com/Prod'

const TWITTER_OAUTH_PATH = '/oauth/twitter/authorize_url'
const TWITTER_OAUTH_CALLBACK_PATH = '/oauth/twitter/callback'
const TWITTER_OAUTH_VERIFY_PATH = '/oauth/twitter/verify'
const PREKEYS_PATH = '/prekeys'
const GET_USERS_PATH = '/users'
const SEARCH_USERS_PATH = '/users/search'

export default process.env.NODE_ENV === 'production' ? {
  REQUIRED_CONFIRMATION_NUMBER: 3,
  ESTIMATE_AVERAGE_BLOCK_TIME: 15000,
  TRANSACTION_TIME_OUT_BLOCK_NUMBER: 50,
  TWITTER_CONSUMER_KEY: '8rBG1xrUBpFgE2T5bDOskGFpv',
  TWITTER_SECRET_KEY: 'WOL2SCR8RJr38LTBlPEqZz4r6fyU9qqCELBeCE7hmbOcuchnDi',

  TWITTER_OAUTH_API: BETA_OAUTH_API_PREFIX + TWITTER_OAUTH_PATH,
  TWITTER_OAUTH_CALLBACK: BETA_OAUTH_API_PREFIX + TWITTER_OAUTH_CALLBACK_PATH,
  TWITTER_OAUTH_VERIFY: BETA_OAUTH_API_PREFIX + TWITTER_OAUTH_VERIFY_PATH,
  PREKEYS_API: BETA_OAUTH_API_PREFIX + PREKEYS_PATH,
  GET_USERS_API: BETA_OAUTH_API_PREFIX + GET_USERS_PATH,
  SEARCH_USERS_API: BETA_OAUTH_API_PREFIX + SEARCH_USERS_PATH,

  GET_PREKEYS_HOST: 'https://dnfwripxp1wh9.cloudfront.net',
  FACEBOOK_APP_ID: '162817767674605',
  DEPLOYED_ADDRESS: 'https://beta.keymesh.io',
} : {
  REQUIRED_CONFIRMATION_NUMBER: 0,
  ESTIMATE_AVERAGE_BLOCK_TIME: 5000,
  TRANSACTION_TIME_OUT_BLOCK_NUMBER: 3,
  TWITTER_CONSUMER_KEY: '8rBG1xrUBpFgE2T5bDOskGFpv',
  TWITTER_SECRET_KEY: 'WOL2SCR8RJr38LTBlPEqZz4r6fyU9qqCELBeCE7hmbOcuchnDi',

  TWITTER_OAUTH_API: DEV_OAUTH_API_PREFIX + TWITTER_OAUTH_PATH,
  TWITTER_OAUTH_CALLBACK: DEV_OAUTH_API_PREFIX + TWITTER_OAUTH_CALLBACK_PATH,
  TWITTER_OAUTH_VERIFY: DEV_OAUTH_API_PREFIX + TWITTER_OAUTH_VERIFY_PATH,
  PREKEYS_API: DEV_OAUTH_API_PREFIX + PREKEYS_PATH,
  GET_USERS_API: DEV_OAUTH_API_PREFIX + GET_USERS_PATH,
  SEARCH_USERS_API: DEV_OAUTH_API_PREFIX + SEARCH_USERS_PATH,

  GET_PREKEYS_HOST: 'https://d3daqpj99mvt84.cloudfront.net',
  FACEBOOK_APP_ID: '402106420236062',
  DEPLOYED_ADDRESS: 'http://localhost:1234',
}
