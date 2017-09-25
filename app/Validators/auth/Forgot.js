'use strict'

class Forgot {

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

module.exports = Forgot
