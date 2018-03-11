'use strict'

class Signup {

  get rules () {
    return {
      email: 'required|email|unique:users',
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
      'email.required': 'Enter email address to be used for login',
      'email.email': 'Email address is not valid',
      'email.unique': 'There\'s already an account with this email address',
      'password.required': 'Choose password for your account'
    }
  }

}

module.exports = Signup
