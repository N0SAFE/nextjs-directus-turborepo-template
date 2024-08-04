#!/usr/bin/env node
"use strict";var o=require("commander"),n=require("child_process"),r=new o.Command;r.name("run-white-error").description("CLI to run a task and restart the process while an error occure").version("0.0.0");r.argument("<run>","cli task to run");r.parse(process.argv);var s=()=>{let e=(0,n.spawn)(r.args[0],{shell:!0,stdio:"inherit"}),t=()=>{console.error(`
\x1B[31mAn error occured, restarting the process\x1B[0m
`),e.kill(),s()};e.on("exit",i=>{i!==0&&t()})};s();
