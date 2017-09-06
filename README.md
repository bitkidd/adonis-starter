# Adonis Starter

This repo is an implementation of a starter pack for Adonis v.4.x with some tweaks.
It is just an example of how you can implement front-end stuff and authentication.

## What's inside?

- Postgresql as a DB layer
- Auth controller (login, signup, confirm email, reset password, resend confirmation, logout)
- Auth emails (welcome email, reset password email)
- Social Auth (via adonis-ally)
- Webpack config
- LESS + ES2015
- Folder structure for views

## Details
- `webpack` configured to compile three stylesheets and scripts for `application`, `manage` and `auth` section of the app
- a special `webpack_asset` global added to `View`, to require those js/css files in views
- a special `host` global added to `View`, to correctly insert links in emails, it take value from `.env` file as a `ADDRESS` variable
- a set of methods in `Auth` controller, including `signup`, `login`, `reset`, `confirm`, `resend`, `logout`
- a set of methods in `SocialAuth` controller, including `redirect`, `callback`
- `welcome` and `forgot` emails for account confirmation and password reset
- `APP_AUTH_PROVIDERS` in `.env` file should be a comma-separated list, for ex.: `facebook,github,instagram`

## How to use
`adonis new <PATH> --blueprint=keeross/adonis-starter`

## How to run
Two terminal windows
- `adonis serve --dev` and `npm run watch` for development 
- `adonis serve` and `npm run build` for production 

## PS
There is a lot of stuff to be done, I will fix them asap
