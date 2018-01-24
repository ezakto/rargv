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

var dirname = path.dirname(file);
var filename = path.basename(file);
var extname = path.extname(filename);
var basename = path.basename(file, extname);
var source = fs.readFileSync(file, { encoding: 'utf8' });

var cmntre = /\/\*([\s\S]+?)\*\//g;
var argvre = /@argv\s+([a-z0-9_-]+)\s+(.+)/g;
var argsre = /[^\s"]+|"(?:\\"|[^"])+"/g;
var pathre = /^(\.\.?\/)/;
var comment;

while (comment = cmntre.exec(source)) {
    comment[1].replace(argvre, function(m, cmd, args){
        if (cmd == command) {
            // Replace variables
            args = args
                .replace(/^\s+|\s$/g, '')
                .replace(/\$dirname\b/g, dirname)
                .replace(/\$filename\b/g, filename)
                .replace(/\$extname\b/g, extname)
                .replace(/\$basename\b/g, basename);

            // Replace relative paths
            args = args.match(argsre).map(function(arg){
                return pathre.test(arg) ? path.normalize(path.join(dirname, arg)) : arg;
            }).join(' ');

            child_process.exec(process.argv.slice(2).join(' ') + ' ' + args, function(err, stdout, stderr){
                if (stdout) process.stdout.write(stdout);
                if (stderr) process.stderr.write(stderr);
            });
        }
    });
}
