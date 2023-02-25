# bulk [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

### Run a command in every directory within a directory.

[![Build Status](https://travis-ci.org/timoxley/bulk.png?branch=master)](https://travis-ci.org/timoxley/bulk)

[![NPM](https://nodei.co/npm/bulk.png?downloads=true&downloadRank=true)](https://nodei.co/npm-dl/bulk/)
[![NPM](https://nodei.co/npm-dl/bulk.png?months=3&height=3&chrome)](https://nodei.co/npm/bulk/)

End goal of this package is to make a more intuitive, simpler alternative to find/grep + xargs.

This is a more generalised fork of [hughsk/scoped-bulk](http://github.com/hughsk/scoped-bulk)

## CLI Usage

``` bash
Usage:
  echo ./* | bulk -c "<command...>"
  bulk -c "<command...>" ./*
```

For example, running the following in your project root might yield something
like this:

``` bash
> ls -A | bulk -c "pwd"
/Users/timoxley/Projects/bulk/.git
/Users/timoxley/Projects/bulk/node_modules
/Users/timoxley/Projects/bulk/test
```

#### Clean all node_modules from children

This works well for cleaning dependencies out of symlinked packages, and allows for rededuplication without doing a full install.

```bash
bulk  -c "rm -rf ." node_modules/*
```

#### Install the dependencies of locally scoped modules:
You can use this, for example, to install the dependencies of locally scoped
modules:

``` bash
echo node_modules/@scoped/* | bulk -c "npm install --production"
```

#### Exit any time a nonzero exit code occurs
Runs all commands but exits on the first nonzero exit code.

``` bash
linklocal list -r | bulk -c 'npm test' -e
```

## License

MIT. See [LICENSE.md](http://github.com/timoxley/bulk/blob/master/LICENSE.md) for details.
