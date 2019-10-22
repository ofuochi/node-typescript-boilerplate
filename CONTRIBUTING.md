# Contributing to Node TypeScript Boilerplate Project

👍🎉 First off, thanks for taking the time to contribute! 👍🎉

When contributing, please follow the community's [Code of Conduct](CODE_OF_CONDUCT.md).

Please use our [Slack Channel](https://join.slack.com/t/nodetypescript-boiler/shared_invite/enQtNzg3NTI3NDc3MzgxLTBmNWI2ZjFlMzcxNTI2MmEyMWI4MDY4NjBlNTNhNzNjY2QxMmQxM2M5OWU4ZDNhMmYzOTNjODUxODllYjM2OGY) to collaborate with other contributors.

<a href="https://communityinviter.com/apps/nodetypescript-boiler/node-typescript-boilerplate" rel="Node TypeScript Boilerplate Community">![Node TypeScript Boilerplate Slack](https://img.shields.io/badge/JOIN-Slack%20Channel-green.svg?longCache=true&style=for-the-badge)</a>

## Issues

Feel free to submit issues and enhancement requests.

## Code Contribution

### Workflow

In general, we follow the "fork-and-pull" Git workflow.

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

### Housekeeping

Your pull request should:

- Include a description of what your change intends to do.
- Have clear commit messages (doesn't have to be long).
- Include adequate tests if your request requires one.
- It is necessary for all tests to pass at each commit.
- Follow the code conventions described in Coding guidelines.
- To avoid or reduce errors from es-lint due to non-standard codes, add an extension for code formatting on your text-editor eg. VS Code, and enable *format-on-save*.

### Coding Guidelines

#### Naming

- Use PascalCase for type names and enum values.
- Use "I" as a prefix for interface names.
- Use camelCase for function names, property names and local variables.
- Use whole words in names when possible.

#### Comments (Code documentation)

- Always use JSDoc style comments to document any public functions, interfaces, classes, enums, and properties.

#### Types

- Always use **undefined**. Do not use **null**.
- Specifying the *type* of parameters is necessary.
For example, x => x + x is incorrect but (x: string) => x + x is correct.
- Avoid the use of type **any** if possible.

#### Style

- Use double quotes for strings.
- Use arrow functions over anonymous function expressions.
- Always surround loop and conditional blocks of code with curly braces. Statements on the same line are allowed to omit braces.
- Open curly braces always go on the same line as whatever necessitates them.
- Use 4 spaces per indentation.

## Bug Report

If you would like to report a bug, please [create an issue on the GitHub repository](https://github.com/ofuochi/node-typescript-boilerplate/issues/new/choose)

## Generated files

The files swagger.json and src/ui/api/routes.generated.ts are both auto-generated and respectively used for swagger documentation and request routing. To make any modifications to them, you will have to direct changes to [https://github.com/lukeautry/tsoa](https://github.com/lukeautry/tsoa)
