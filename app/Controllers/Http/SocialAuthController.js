'use strict'

const Env = use('Env')
const User = use('App/Models/User')

class SocialAuthController {

  async redirect({ request, response, params, auth, ally }) {
    const providers = Env.get('APP_AUTH_PROVIDERS', '').split(',')
    const { provider } = params

    // check if requested provider is in the list
    if ( providers.includes( provider ) ) {
      await ally.driver( provider ).redirect()
    } else {
      return response.route('root')
    }

  }

  async handleCallback ({ request, response, session, params, ally, auth }) {
    const providers = Env.get('APP_AUTH_PROVIDERS', '').split(',')
    const { provider } = params

    // check if requested provider is in the list
    if ( !providers.includes( provider ) ) {
      return response.route('root')
    }

    // get basic user data
    const data = await ally.driver( provider ).getUser()

    // search params
    const searchParams = {
      email: data.getEmail()
    }

    // combine data for new user
    const newUser = {
      email: data.getEmail(),
      password: Math.random().toString(18).substr(2, 8),
      provider: provider
      // avatar: user.getAvatar(),
      // username: data.getName()
    }

    // find user
    let user = await User.findBy( 'email', data.getEmail() )

    // if no user, create
    if ( !user ) {
      user = await User.create( newUser )
    }

    // trying to login user
    try {
      await auth.login( user )
      session.flash({ flash_info: 'Logged in successfully.' })
      return response.route('root')
    } catch (e) {
      session.flash({ flash_error: e.message })
      return response.redirect('root')
    }
  }


}

module.exports = SocialAuthController
