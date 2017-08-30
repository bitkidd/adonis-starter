'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

/*
|---------------
|- MAIN
|---------------
*/

Route.get('/', ({ view }) => {
  return view.render('index')
}).as('root')

/*
|---------------
|- AUTH
|---------------
*/

Route.on('/login').render('auth.login').as('login')
Route.on('/signup').render('auth.signup').as('signup')
Route.on('/resend').render('auth.resend').as('resend')
Route.on('/forgot').render('auth.forgot').as('forgot')
Route.get('/reset/:token', 'AuthController.render_reset').as('reset')
Route.get('/confirm/:token', 'AuthController.confirm').as('confirm')
Route.get('/logout', 'AuthController.logout').as('logout')

Route.group(() => {

  Route.post('/signup' , 'AuthController.signup').as('auth.signup')
  Route.post('/login'  , 'AuthController.login').as('auth.login')
  Route.post('/resend' , 'AuthController.resend').as('auth.resend')
  Route.post('/forgot' , 'AuthController.forgot').as('auth.forgot')
  Route.post('/reset'  , 'AuthController.reset').as('auth.reset')

}).prefix('auth')
