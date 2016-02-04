#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var command = process.argv[2];
var file = process.argv[3];

if (!file || !command || command == 'help' || command == '--help') {
    console.log(
        'usage: rargv <command> <file> [extras]\n\n',
        'rargv will scan for extra argv parameters in the input <file> and append them to the argument list\n\n',
        'Go to https://github.com/ezakto/rargv for a detailed explanation'
    );
    return;
}

var filename = path.basename(file);
var dirname = path.dirname(file);
var source = fs.readFileSync(file, { encoding: 'utf8' });
var regexp = /\/\*\*\s*@argv\s+([a-z0-9_-]+)\s+([^\n]+?)\s*\*\//g;

source.replace(regexp, function(m, cmd, args){
    args = args.replace(/\$filename\b/, filename);
    args = args.replace(/\$dirname\b/, dirname);
    if (cmd == command) {
        child_process.exec(process.argv.slice(2).join(' ') + ' ' + args, function(err, stdout, stderr){
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
        });
    }
});