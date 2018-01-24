# rargv
Node.js tool to read command line arguments from input files

When using some cli tools to process/transform files, there are some common arguments we have to write again and again, some arguments won't change for certain files, and stuff like that.
This is often solved with configuration files (aka rc files), but sometimes we need basic configuration in a per-file basis.
The idea of this tool is to include argv parameters inside the files and read them right before executing the target command.

## Install
```
$ npm install -g rargv
```

## Usage

### Specifying arguments inside a file
Do it within comments with this format:
```
/* @argv <tool> <arguments> */
```
`arguments` will be appended to the argument list when this file is going to be processed by the specified `tool`.
For example:
```
/* @argv lessc ./css/compiled.css */
```

Now we have to proxy our command (in this example, for `lessc`) with `rargv` in order to correctly parse and apply the defined parameters.
```
$ rargv lessc source.less
```
Rargv will read the file `source.less`, check if there's something configured for the invoked tool (`lessc`) and if so, it'll append what's defined in there and run the full command. So, this will equivalent to:
```
$ lessc source.less css/compiled.css
```

#### More complex example
In a javascript file:
```
/* @argv browserify -o ../../dist/js/app.js -t babelify */
```
Then, running `$ rargv browserify sources/js/myfile.js` will translate to:
```
$ browserify sources/js/myfile.js -o dist/js/app.js -t babelify
```

#### Variables
There are some variables exposed to the @argv directive:

* `$filename` filename with extension, for example: `index.html`
* `$basename` filename without extension, for example: `index`
* `$extname` file extension, for example: `.html`
* `$dirname` directory name, relative from the cwd, for example: `.`

## Copyright and Licensing

Copyright (c) 2016 Nicolás Arias, released under the MIT license.
