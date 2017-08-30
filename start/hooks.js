'use strict'

const fs = require('fs')
const path = require('path')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(function () {

  const View = use('Adonis/Src/View')
  const Env = use('Env')

  // webpack asset insert
  View.global('webpack_asset', function (url) {
    url = url.split('.')
    const data = JSON.parse( fs.readFileSync( path.join(__dirname, '..', 'public', 'build', 'assets.json'), 'utf8') )
    const file = data[ url[0] ][ url[1] ]
    const ext = url[1]
    let str = ''

    if ( ext === 'css' ) {
      str = `<link rel="stylesheet" href="${file}" />`
    }

    if ( ext === 'js' ) {
      str = `<script type="text/javascript" src="${file}"></script>`
    }

    return this.safe( str )
  })

  // email confirmation link insert
  View.global('host', function () {
    const address = Env.get('ADDRESS', '127.0.0.1:3333')
    return this.safe( address )
  })


})
