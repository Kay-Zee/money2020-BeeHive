# init() frontend

### Project Setup

##### Folder Structure

`images` - Images, will be optimized automatically through [mozjpeg()](https://github.com/imagemin/imagemin-mozjpeg), [pngquant()](https://github.com/imagemin/imagemin-pngquant), and [optipng()](https://github.com/imagemin/imagemin-optipng)

`js` - Client-side scripts, optimized with gulp-usemin

`- libs` - JavaScript libraries that are not in Bower or need customization

`src` - Server-side scripts, [Node.js](https://nodejs.org/) with [Express](http://expressjs.com/)

`- models` - Business logic

`- routes` - Routes

`styles` - CSS (through Stylus)

`views` - HTML (through Jade)

##### Quirks and Questions

> How do I add a JS library/framework/plugin to my project?

If the project doesn't exist on [Bower](http://bower.io) (`bower search xxxx` from your Terminal), put the files in `/scripts/libs`. They will be compiled to `/public/js/libs` on save.

> I added a CSS/JS/image file to `/public` but it keeps disappearing. What is going on?

The `/public` folder is deleted every time the project is built using a `gulp` command. It is rebuilt, compiling (and optimizing) everything from `/images`, `/scripts`, and `/stylus`, to ensure everyone has the correct (and optimized) version depending on the environment.

> I want to add a custom font to the project. How do?

If you're using local fonts, put them in `/fonts`, they will be compiled to `/public/fonts`. If you're using web fonts, load them through the Web Font Loader at the bottom of `layout.jade`.

##### Checklist

- `layout.jade` fill in your Google Analytics tracking code
- `layout.jade` fill in default meta tag info - meta tags in `block` can be changed per page
- `layout.jade` site-wide JS should go at the bottom of `build:js`
- `index.jade` page-specific JS should be built on that page through `block extra-scripts`

### Development and Deployment

##### Setup

```
npm i -g gulp bower
npm i
gulp
```

Local server on [http://localhost:3000](http://localhost:3000)

##### Environment Variables

These variables need to be set locally or on the server.

##### Locally

```
$ export NODE_ENV=XXXX        // development staging production
```

##### Server (Heroku)
```
$ heroku config:set -a {app-name} {variable}
```

##### Heroku Environment Variables
```
$ heroku config:set NEW_RELIC_APP_NAME=XXXX
$ heroku config:set NEW_RELIC_LICENSE_KEY=XXXX
$ heroku config:set NEW_RELIC_TRACE=info
```


