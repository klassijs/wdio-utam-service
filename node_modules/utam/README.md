# UTAM - UI Test Automation Model

UI Test Automation Model (UTAM) is based on the popular Page Object model design pattern commonly used in UI tests.
Instead of using an object-oriented class to write a page object, a UTAM page object is authored in JSON, and described
by an easy-to-understand UTAM grammar. The `utam` package is the entry point for generating JavaScript page objects.

## Installation

Add `utam` as a `devDependency` in your `package.json`:

```sh
yarn add --dev utam
# or via npm
npm add --dev utam
```

## Usage

This package exposes a CLI tool, `utam`, that

-   generates JavaScript page objects from declarative JSON files
-   generates UTAM JSON files from HTML

It's the main package that should be installed to use UTAM for page object authoring and generation.

Visit [`wdio-utam-service`][npm-wdio-utam-service-pkg] to learn how to use UTAM with WebDriverIO in your UI tests.

### Configure and run the UTAM Compiler

Start by [configuring the UTAM compiler][docs-compiler-config] to match your project structure and requirements.

Generate JavaScript page objects by running `utam` either via the cli:

```sh
npx utam -c utam.config.json
```

Or via a script in your package manifest:

```jsonc
// package.json
{
    // ...
    "scripts": {
        "build": "utam -c utam.config.json"
    }
    // ...
}
```

Invoke the script with:

```sh
yarn build

# or via npm
npm run build
```

### Configure and run the UTAM Generator

Start by configuring the UTAM generator (documentation to be added) to match your requirements.

Generate UTAM JSON page objects by running `utam-generate` either via the cli:

```sh
npx utam-generate -c generator.config.json
```

Or via a script in your package manifest:

```jsonc
// package.json
{
    // ...
    "scripts": {
        "build": "utam-generate -c generator.config.js"
    }
    // ...
}
```

## CLI

Use the `utam` command to run the UTAM compiler from the command line:

```
utam [options]
```

> Note: You don't have to specify options.

### `--config`

Use the `--config` option to specify the compiler configuration file path:

```sh
utam --config path/to/project/utam.config.json
```

> Note: you don't need to specify that option if your project has a `utam.config.js` config file at the package root or
> if your `package.json` file has a `utam` configuration key.

### `--projects`

Use the `--projects` option to specify projects to use in compilation:

```sh
# Project1 contains either a utam.config.js or has a `utam` key in `package.json`
utam --projects path/to/project1 path/to/project2/utam.config.json
```

A project is a folder that contains some configuration for the UTAM compiler.
A valid project is a folder that contains either:

1. A `utam.config.js` config file
2. A `utam.config.json` config file
3. A `utam` config object in the package manifest (`package.json`)

> Note: A configuration file can have any name. The `utam.config` prefix is a convention.

### `--target`

Use the `--target` option to specify the module system of default page objects. Options are (`commonjs` or `module`).

```sh
# Generate page objects that use ES Modules by default
utam --target module

# Generate page objects that use CommonJS by default
utam --target commonjs
```

Default page objects are the generated page objects with a `.js` file extension.

## Documentation

[utam.dev][utam-dev] has all the information you need to get started with UTAM, including [guides][doc-guides],
[tutorials][doc-tutorials] and the [JSON grammar][doc-grammar].

[npm-wdio-utam-service-pkg]: https://www.npmjs.com/package/wdio-utam-service
[docs-compiler-config]: https://utam.dev/guide/js-guide#compiler-setup
[utam-dev]: https://utam.dev
[doc-guides]: https://utam.dev/guide/introduction
[doc-tutorials]: https://utam.dev/tutorial/introduction
[doc-grammar]: https://utam.dev/grammar/spec
