'use strict'

const Event = use('Event')

// AUTH events
Event.on('AUTH_SIGNUP', 'Auth.signup')
Event.on('AUTH_RESEND_CONFIRMATION', 'Auth.resend_confirmation')
Event.on('AUTH_FORGOT_PASSWORD', 'Auth.forgot_password')
