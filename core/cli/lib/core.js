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
	.demandCommand(1, "A command is required. Pass --help to see all available commands and options.") // 最少命令及报错信息
	.strict()
	.recommendCommands() // 猜测命令
	.fail((err, msg) => { // 失败命令
		console.log(err)
	})
	.alias("h", "help")
	.alias("v", "version") // 指令别名
	.wrap(cli.terminalWidth()) // 修改宽度
	.epilogue(dedent`
    When a command fails, all logs are written to lerna-debug.log in the current working directory.

    For more information, find our manual at https://github.com/lerna/lerna
    `) // 结尾的话
	.options({
		debug: {
			type: 'boolean',
			describe: 'Bootstrap debug mode',
			alias: 'd'
		}
	}) // 增加全局的选项
	.option('registry', {
		type: 'string',
		describe: 'define global registry',
		alias: 'r'
	})
	.group(['debug'], 'Dev options:') // 分组
	.command('init [name]', 'Do init a project', (yargs) => {
		yargs.option('name', {
			type: 'string',
			describe: 'Name of a project',
			alias: 'n'
		})
	}, (argv) => {
		console.log(argv)
	}) // 定义命令（4 个部分：命令详情，命令描述，构建命令，执行命令）
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
	.parse(argv, context) // 解析参数  // context 合并（当作默认参数）
 
	