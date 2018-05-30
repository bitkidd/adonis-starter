'use strict'

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', ['UserHook.setDefaults', 'UserHook.hashPassword'])

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

  static get admins () {
    return ['manager@example.com']
  }

}

module.exports = User
