'use strict'

class SocialAuthController {

  async redirect({ request, params, auth, ally }) {
    const { provider } = params
    await ally.driver( provider ).redirect()
  }

  async handleCallback ({ request, response, params }) {
    const { provider } = params
    const data = await ally.driver( provider ).getUser()

    // search params
    const searchParams = {
      email: user.getEmail()
    }

    // combine data for new user
    const newUser = {
      email: data.getEmail(),
      // avatar: user.getAvatar(),
      username: data.getName()
    }

    // find user
    const user = await User.findOrCreate( searchParams, newUser )

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


}

module.exports = SocialAuthController
