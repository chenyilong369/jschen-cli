#!/usr/bin/env node

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const dedent = require('dedent')
const pkg = require('../package.json')
// const arg = hideBin(process.argv)

const cli = yargs()

const context = {
	jschenCliVersion: pkg.version,
}

const argv = process.argv.slice(2)

cli.usage('Usage: $0 [command] <options>')
	.demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
	.strict()
	.recommendCommands()
	.fail((err, msg) => {
		console.log(err)
	})
	.alias("h", "help")
	.alias("v", "version")
	.wrap(cli.terminalWidth())
	.epilogue(dedent`
    When a command fails, all logs are written to lerna-debug.log in the current working directory.

    For more information, find our manual at https://github.com/lerna/lerna
    `)
	.options({
		debug: {
			type: 'boolean',
			describe: 'Bootstrap debug mode',
			alias: 'd'
		}
	})
	.option('registry', {
		type: 'string',
		describe: 'define global registry',
		alias: 'r'
	})
	.group(['debug'], 'Dev options:')
	.command('init [name]', 'Do init a project', (yargs) => {
		yargs.option('name', {
			type: 'string',
			describe: 'Name of a project',
			alias: 'n'
		})
	}, (argv) => {
		console.log(argv)
	})
	.command({
		command: 'list',
		aliases: ['ls', 'la', 'll'],
		describe: "List local packages",
		builders: (yargs) => {
		},
		handler: (argv) => {
			console.log(argv)
		}
	})
	.parse(argv, context)
 