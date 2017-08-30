'use strict'

const Hash = use('Hash')

const UserHook = module.exports = {}

UserHook.hashPassword = async (userInstance) => {
  if (userInstance.password) {
    userInstance.password = await Hash.make(userInstance.password)
  }
}

UserHook.setDefaults = async (userInstance) => {
  userInstance.uid = Math.random().toString(18).substr(2, 8)
  userInstance.role = (userInstance.email == '---' ? 'admin' : 'subscriber')
}

UserHook.setConfirmationToken = async (userInstance) => {
  let token_part_1 = Math.random().toString(18).substr(2, 8)
  let token_part_2 = Math.random().toString(18).substr(5, 8)
  let token_part_3 = Math.random().toString(18).substr(10, 8)
  userInstance.confirmation_token = `${token_part_1}-${token_part_2}-${token_part_3}`
}
