'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection to be used for sending emails. Each connection needs to
  | define a driver too.
  |
  */
  connection: Env.get('MAIL_CONNECTION', 'smtp'),

  /*
  |--------------------------------------------------------------------------
  | SMTP
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending emails via SMTP.
  |
  */
  smtp: {
    driver: 'smtp',
    pool: true,
    port: 587,
    host: 'email-smtp.eu-west-1.amazonaws.com',
    secure: false,
    requireTLS: true,
    auth: {
      user: Env.get('MAIL_USERNAME'),
      pass: Env.get('MAIL_PASSWORD')
    },
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10
  },

  /*
  |--------------------------------------------------------------------------
  | SparkPost
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for spark post. Extra options can be defined
  | inside the `extra` object.
  |
  | https://developer.sparkpost.com/api/transmissions.html#header-options-attributes
  |
  | extras: {
  |   campaign_id: 'sparkpost campaign id',
  |   options: { // sparkpost options }
  | }
  |
  */
  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  },


  ses: {
    driver: 'ses',
    apiVersion: '2012-10-17',
    accessKeyId: Env.get('SES_KEY'),
    secretAccessKey: Env.get('SES_SECRET'),
    region: 'eu-west-1',
    rateLimit: 10
  }
}
