'use strict'

const uuid = use('uuid/v1')
const { validate } = use('Validator')
const Hash = use('Hash')
const Mail = use('Mail')
const User = use('App/Models/User')
const Event = use('Event')

class AuthController {

  async signup ({ request, response, session }) {

    const data = request.only(['email', 'password'])

    // create user
    const user = await User.create( data )

    // send email
    Event.fire('AUTH_SIGNUP', user)

    // send response
    session.flash({ flash_info: 'Account created. Please verify your email.' })
    return response.route('login')

  }

  async login ({ request, session, response, auth }) {

    const data = request.only(['email', 'password'])

    // find or fail user by email
    const user = await User.findBy('email', data.email )
    if ( !user ) {
      session.flash({ flash_error: 'Wrong email or password.' })
      return response.redirect('back')
    }

    // check if verified
    if ( user.confirmation_token ) {
      session.flash({ flash_error: 'Please verify your account first.' })
      return response.redirect('back')
    }

    // match password
    const isMatchedPassword = await Hash.verify( data.password, user.password )

    // if password not matched
    if ( !isMatchedPassword ) {
      session.flash({ flash_error: 'Wrong email or password.' })
      return response.redirect('back')
    }

    // trying to login user
    try {
      await auth.login( user )
      session.flash({ flash_info: 'Logged in successfully.' })
      return response.route('root')
    } catch (e) {
      session.flash({ flash_error: e.message })
      return response.redirect('back')
    }
  }

  async confirm ({ response, session, params }) {
    const token = params.token
    const user = await User.findBy('confirmation_token', token)

    // check if token exists
    if ( !token.length ) {
      return response.redirect('root')
    }

    // if user exists
    if ( user ) {
      user.confirmation_token = null
      await user.save()
      session.flash({ flash_info: 'Account verified, thank you. You can now log in.' })
    }

    return response.route('root')
  }

  // resend confirmation token
  async resend ({ request, response, session }) {

    const data = request.only(['email'])

    // find or fail user by email
    const user = await User.findBy('email', data.email )
    if ( !user ) {
      session.flash({ flash_info: 'If the email you entered was right, in a minute you will receive the link to confirm your account.' })
      return response.redirect('login')
    }

    // check if already verified
    if ( !user.confirmation_token ) {
      session.flash({ flash_info: 'Your account is already verified.' })
      return response.route('root')
    }

    // resend verification
    Event.fire('AUTH_RESEND_CONFIRMATION', user)

    // send response
    session.flash({ flash_info: 'If the email you entered was right, in a minute you will receive the link to confirm your account.' })
    return response.route('login')

  }

  // forgot password
  async forgot ({ request, response, session }) {

    const data = request.only(['email'])

    // find or fail user by email
    const user = await User.findBy('email', data.email )
    if ( !user ) {
      session.flash({ flash_info: 'If the email you entered was right, in a minute you will receive the link to reset the password.' })
      return response.redirect('back')
    }

    // add reset token to user
    user.reset_token = uuid()
    await user.save()

    // resend verification
    Event.fire('AUTH_FORGOT_PASSWORD', user)

    // send response
    session.flash({ flash_info: 'If the email you entered was right, in a minute you will receive the link to reset the password.' })
    return response.route('root')
  }

  // render reset password page
  async render_reset ({ response, params, view }) {
    const token = params.token

    // check if token exists
    if ( !token.length ) {
      return response.route('root')
    }

    // find or fail user by reset token
    const user = await User.findBy('reset_token', token )
    if ( !user ) {
      return response.route('root')
    }

    return view.render('auth.reset', { token: token })

  }

  // reset password
  async reset ({ request, response, session }) {

    const data = request.only(['token', 'password'])

    // find or fail user by reset token
    const user = await User.findBy('reset_token', data.token )
    if ( !user ) {
      return response.route('root')
    }

    // add new password to user
    user.password = await Hash.make( data.password )
    user.reset_token = null
    await user.save()

    session.flash({ flash_info: 'Password has been changed, thank you.' })
    return response.route('root')

  }

  // logout
  async logout ({ response, session, auth }) {

    session.flash({ flash_info: 'Logged out successfully' })
    await auth.logout()
    return response.route('root')

  }

}

module.exports = AuthController
