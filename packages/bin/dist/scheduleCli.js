#!/usr/bin/env node
"use strict";var n=require("commander"),o=require("node-cron"),e=require("child_process"),r=new n.Command;r.name("cron").description("CLI to run cron jobs that run cli").version("0.0.0");r.argument("<cron>","cron string to parse").argument("<cli>","run cli");r.parse(process.argv);(0,o.schedule)(r.args[0],s=>{console.log(s,"Running cron job:",r.args[1]),(0,e.spawnSync)(r.args[1],{stdio:"inherit",shell:!0})},{runOnInit:!0});
