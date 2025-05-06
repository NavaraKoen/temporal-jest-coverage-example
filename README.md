# Temporal mocha vs jest comparison

This is scaffolded using the default project when you run `npx @temporalio/create@latest ./myfolder`.

## Context
We have several issues with coverage when using Jest instead of mocha. Jest does not work even out-of-the box.
To simulate the issues we're having, I have setup this repository with simple workflows and tests that are for both jest and mocha.

They can be ran independently using the scripts in the package json.

## Problem statement
In this repo, we have (at least to some extent) proof that the jest coverage does not work as expected. The mocha setup has the exact same tests, however reproduces a fully covered result. The jest setup does not, it claims that -some- things in workflows.ts are not tested, while they most definitely are.

The Jest results (generated using `npm run test`):
```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   90.62 |       75 |    87.5 |    93.1 |                   
 src               |      80 |       50 |      80 |   84.61 |                   
  activities.ts    |     100 |      100 |     100 |     100 |                   
  workflows.ts     |   66.66 |       50 |      50 |      75 | 16-19             
 src/jest          |     100 |      100 |     100 |     100 |                   
  coverage.hack.ts |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```
Note the uncovered lines here - they are **not consistent**. I've also seen an uncovered line 22, which is the last closing bracket. In general, it does not make much sense. 

Then the mocha test results, generated using `npm run test:mocha:coverage`:
```
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |                   
 activities.ts |     100 |      100 |     100 |     100 |                   
 workflows.ts  |     100 |      100 |     100 |     100 |                   
---------------|---------|----------|---------|---------|-------------------
```
