'use strict'

class Login {

  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email'
    }
  }

  get messages () {
    return {
      'email.required': 'Email is required to login to your account',
      'email.email': 'Enter a valid email address to login to your account',
      'password.required': 'Enter your account password'
    }
  }

}

module.exports = Login
