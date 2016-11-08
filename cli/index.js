#!/usr/bin/env node
let build = require('./build');
let post = require('./post');
let server = require('./server');

switch(process.argv[2]){
    case 'build':
        build();
        break;
    case 'post':
        post(process.argv[3],process.argv[4]);
        break;
    case 'server':
        server();
        break;
}