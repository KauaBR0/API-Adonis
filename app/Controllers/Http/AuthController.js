'use strict'

const User = use('App/Models/User')

class AuthController {
  async signup ({ request, response }) {
    const data = request.only(['email', 'password'])

    try {
      const user = await User.create(data)
      return response.created(user)
    } catch (error) {
      return response.status(400).json({
        message: 'Error during user registration.',
        error: error.message
      })
    }
  }

  async login ({ request, response, auth }) {
    const { email, password } = request.all()

    try {
      const token = await auth.attempt(email, password)
      return token
    } catch (error) {
      return response.status(401).json({
        message: 'Invalid credentials'
      })
    }
  }
}

module.exports = AuthController
