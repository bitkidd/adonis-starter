'use strict'

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'UserHook.setDefaults')
    this.addHook('beforeCreate', 'UserHook.hashPassword')
    this.addHook('beforeCreate', 'UserHook.setConfirmationToken')

  }

  // Relations
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  // roles
  static get roles () {
    return ['admin', 'manager', 'subscriber']
  }

  // hide fields
  static get hidden () {
    return ['password']
  }

  // validation rules
  static get rules () {
    return {
      login: {
        email: 'required|email',
        password: 'required'
      },
      register: {
        email: 'required|email|unique:users',
        password: 'required'
      },
      resend: {
        email: 'required|email'
      },
      forgot: {
        email: 'required|email'
      },
      reset: {
        password: 'required'
      }
    }
  }

  // validation messages
  static get messages () {
    return {
      login: {
        'email.required': 'Email is required to login to your account',
        'email.email': 'Enter a valid email address to login to your account',
        'password.required': 'Enter your account password'
      },
      register: {
        'email.required': 'Enter email address to be used for login',
        'email.email': 'Email address is not valid',
        'email.unique': 'There\'s already an account with this email address',
        'password.required': 'Choose password for your account'
      },
      resend: {
        'email.required': 'Email is required',
        'email.email': 'Enter a valid email address'
      },
      forgot: {
        'email.required': 'Email is required',
        'email.email': 'Enter a valid email address'
      },
      reset: {
        'password.required': 'Enter your new account password'
      }
    }
  }
}

module.exports = User
