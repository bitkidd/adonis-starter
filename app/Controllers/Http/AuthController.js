'use strict'

const { validate } = use('Validator')
const Hash = use('Hash')
const Mail = use('Mail')
const User = use('App/Models/User')

class AuthController {

  async signup ({ request, response, session }) {

    const rules = User.rules.register
    const messages = User.messages.register
    const data = request.only(['email', 'password'])
    const validation = await validate( data, rules, messages )

    // failed validation
    if ( validation.fails() ) {
      session
        .withErrors( validation.messages() )
        .flashExcept(['password'])

      return response.redirect('back')
    }

    // create user
    const user = await User.create( data )

    // send email
    await Mail.send('emails.welcome', { token: user.confirmation_token }, (message) => {
      message.from('noreply@example.com')
      message.subject('Welcome to Adonis Starter')
      message.to( user.email )
    })

    // send response
    session.flash({ flash_info: 'Account created. Please verify your email.' })
    return response.route('login')

  }

  async login ({ request, session, response, auth }) {
    const rules = User.rules.login
    const messages = User.messages.login
    const data = request.only(['email', 'password'])
    const validation = await validate( data, rules, messages )

    // failed validation
    if ( validation.fails() ) {
      session
        .withErrors( validation.messages() )
        .flashExcept(['password'])

      return response.redirect('back')
    }

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
    const rules = User.rules.resend
    const messages = User.messages.resend
    const data = request.only(['email'])
    const validation = await validate( data, rules, messages )

    // failed validation
    if ( validation.fails() ) {
      session
        .withErrors( validation.messages() )

      return response.redirect('back')
    }

    // find or fail user by email
    const user = await User.findBy('email', data.email )
    if ( !user ) {
      session.flash({ flash_error: 'Wrong email or password.' })
      return response.redirect('back')
    }

    // check if already verified
    if ( !user.confirmation_token ) {
      session.flash({ flash_info: 'Your account is already verified.' })
      return response.route('root')
    }

    // resend verification
    await Mail.send('emails.welcome', { token: user.confirmation_token }, (message) => {
      message.from('noreply@example.com')
      message.subject('Verification email')
      message.to( user.email )
    })

    // send response
    session.flash({ flash_info: 'Recheck your email. Please verify your account.' })
    return response.route('login')

  }

  // forgot password
  async forgot ({ request, response, session }) {
    const rules = User.rules.forgot
    const messages = User.messages.forgot
    const data = request.only(['email'])
    const validation = await validate( data, rules, messages )

    console.log( data )

    // failed validation
    if ( validation.fails() ) {
      session
        .withErrors( validation.messages() )

      return response.redirect('back')
    }

    // find or fail user by email
    const user = await User.findBy('email', data.email )
    if ( !user ) {
      session.flash({ flash_error: 'Wrong email or password.' })
      return response.redirect('back')
    }

    // add reset token to user
    const token_part_1 = Math.random().toString(18).substr(2, 8)
    const token_part_2 = Math.random().toString(18).substr(5, 8)
    const token_part_3 = Math.random().toString(18).substr(10, 8)
    user.reset_token = `${token_part_1}-${token_part_2}-${token_part_3}`
    await user.save()

    // resend verification
    await Mail.send('emails.forgot', { token: user.reset_token }, (message) => {
      message.from('noreply@example.com')
      message.subject('Reset password')
      message.to( user.email )
    })

    // send response
    session.flash({ flash_info: 'Reset password email has been sent.' })
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
    const rules = User.rules.reset
    const messages = User.messages.reset
    const data = request.only(['token', 'password'])
    const validation = await validate( data, rules, messages )

    // failed validation
    if ( validation.fails() ) {
      session
        .withErrors( validation.messages() )
        .flashExcept(['password'])

      return response.redirect('back')
    }

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

}

module.exports = AuthController
