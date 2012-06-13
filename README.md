# Github contributions

## Description

Very simple application that shows you the public contributions a given user did on github.

In order to do that, the applications:

- searches your public forks;
- for each fork, fetches the original repo;
- for each original repo, checks if your github username appears in the contributors list;
- if it does, it is considered to be a github contribution.

## Try it online

You can try it online [here](http://contribs.herokuapp.com/).

## Technologies

On the server side, this app runs on top of [node.js](http://nodejs.org/) and [express.js](http://expressjs.com/). 
Express.js is basically serving a static file and a bunch of assets. This is a client app and it doesn't require a service layer.

On the frontend, it's a basic web application built using [ember.js](http://emberjs.com/) and twitter bootstrap. Moreover, 
it uses [github's API v3](http://developer.github.com/v3/) and the usual suspects (HTML, CSS and jQuery).

## Run it locally

If you want to run it locally, follow these simple steps:

    git clone git@github.com:carvil/github-contributions.git
    cd github-contributions

Then, install the dependencies (I assume you have node installed, otherwise follow [these](https://github.com/joyent/node/wiki/Installation) instructions first):

    npm install

Once that's done, you can run it with:

    node app.js

The application will be available on `localhost:3000`

## COPYRIGHT

Copyright (c) 2012 Carlos Vilhena. See [LICENSE](https://github.com/carvil/github-contributions/blob/master/LICENSE) for details.
