'use strict'

class Resend {

  get rules () {
    return {
      email: 'required|email'
    }
  }

  get messages () {
    return {
      'email.required': 'Email is required',
      'email.email': 'Enter a valid email address'
    }
  }

}

module.exports = Resend
