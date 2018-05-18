# tronex-ui

## Install
`git clone https://github.com/leeth1989/tronex-ui.git`
`cd tronex-ui`
`npm install`

## Config
To change tronex service backend, change `127.0.0.1:8080` to your backend's 
address (it should be a external ip and a port) in config file `src/utils/config.js`

## Start a develop server
`npm run start`

## Deploy behind an nginx server
`npm run build`
`cp -r dist ${YOUR_NGINX_SERVCE_FOLDER}`
