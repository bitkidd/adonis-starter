# Adonis Starter

This repo is an implementation of a starter pack for Adonis v.4.x with some tweaks.
It is just an example of how you can implement front-end stuff and authentication.

## What's inside?

- Postgresql as a DB layer
- Auth controller (login, signup, confirm email, reset password, resend confirmation, logout)
- Auth emails (welcome email, reset password email)
- Auth validators
- Social Auth (via adonis-ally)
- Webpack v4.x default config
- LESS + ES6+
- Folder structure for views

## Details
- `webpack` configured to compile three stylesheets and scripts for `application`, `manage` and `auth` section of the app
- a special `webpack_asset` global added to `View`, to require those js/css files in views
- a special `host` global added to `View`, to correctly insert links in emails, it take value from `.env` file as a `APP_URL` variable
- a set of methods in `Auth` controller, including `signup`, `login`, `reset`, `confirm`, `resend`, `logout`
- a set of methods in `SocialAuth` controller, including `redirect`, `callback`
- `welcome` and `forgot` emails for account confirmation and password reset
- `APP_AUTH_PROVIDERS` in `.env` file should be a comma-separated list, for ex.: `facebook,github,instagram`
- `APP_FROM_TITLE` and `APP_FROM_EMAIL` in `.env` file describe and form a `message.from()` string, that is used to send default transactional emails

## How to use
`adonis new <PATH> --blueprint=keeross/adonis-starter`

## How to run
Two terminal windows
- `adonis serve --dev` and `npm run watch` for development 
- `adonis serve` and `npm run build:prod` for production

## Production
For `production` it has an npm script that is works on `postinstall` hook activation, it migrates database and runs build for assets. All front-end assets and included in main deps for server compilation, I use DOKKU for deploying, anyway it is up to you.
