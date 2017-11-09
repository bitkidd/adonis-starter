'use strict'

class Handler {
  
  _getYouchError (error, req, isJSON) {
    const Youch = require('youch')
    const youch = new Youch(error, req)
    if (isJSON) {
      return youch.toJSON()
    }
    return youch.toHTML()
  }
  
  _getPlainError (error, isJSON) {
    return isJSON ? {
      message: error.message,
      name: error.name,
      code: error.code,
      status: error.status
    } : `${error.name}: ${error.message}`
  }
  
  async handle (error, { request, response, view }) {
    const isJSON = request.accepts(['html', 'json']) === 'json'    

    if (process.env.NODE_ENV === 'development') {
      const formattedError = await this._getYouchError(error, request.request, isJSON)
      response.status(error.status).send(formattedError)
      return
    }

    return response.send( view.render('errors.index', { error }) )
  }
}

module.exports = Handler