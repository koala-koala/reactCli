#!/usr/bin/env node

var program = require("commander");
var chalk = require("chalk");
var inquirer = require("inquirer");
var download = require("download-git-repo");
const fs = require("fs");
const handlebars = require("handlebars");
const symbols = require("log-symbols");
const ora = require("ora");

program
  .version("0.0.1")
  .command("init <name>")
  .description("init a react app...")
  .action(name => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "author",
          message: "请输入作者名称"
        },
        {
          type: "input",
          name: "description",
          message: "请输入描述"
        }
      ])
      .then(answers => {
        // clone时遇到128问题，可能是仓库地址不对，也有可能是项目已存在
        const spinner = ora("loading").start();

        download(
          "direct:https://github.com/koala-koala/react-template.git#master",
          name,
          {
            clone: true
          },
          err => {
            if (err) {
              console.log(symbols.error, err);
              spinner.stop();
              return;
            }
            const { description, author } = answers;
            const meta = {
              name,
              author,
              description
            };
            const fileName = `${name}/package.json`;
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
            spinner.stop();
            console.log(symbols.success, chalk.green(`${name} init success`));
          }
        );
      })
      .catch(err => {
        console.log(symbols.error, err);
        spinner.stop();
      });
  });

program.parse(process.argv);
