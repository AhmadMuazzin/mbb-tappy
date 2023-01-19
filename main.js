// require('dotenv').config()
//
require('./db/mongoose');
const Attd = require('./models/attendance');
const fs = require('fs');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
// const { Telegraf } = require("telegraf");


console.log(`
__  ________   ______   _________    ____  ______  __
/  |/  /  _/ | / /  _/  /_  __/   |  / __ \/ __ \ \/ /
/ /|_/ // //  |/ // /     / / / /| | / /_/ / /_/ /\  / 
/ /  / // // /|  // /     / / / ___ |/ ____/ ____/ / /  
/_/  /_/___/_/ |_/___/    /_/ /_/  |_/_/   /_/     /_/                                                      
`)

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('syamil', (ctx) => ctx.replyWithPhoto({ source: '305081440_391562859721132_2427466848185335632_n.webp' }))
bot.hears('haziq', ctx => ctx.replyWithPhoto({source: 'haziq1.jpeg'}))
bot.hears('faz', (ctx) => ctx.reply('Fazpro'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

const WORK_ACTIONS = ["Home", "Office"]
const LEAVE_ACTIONS = [
    "Annual", 
    "Emergency", 
    "Medical", 
    "Hospitalization", 
    "Replacement", 
    "Unrecorded",
    "Block Leave",
    "Maternity",
    "Marriage",
    "Sabbatical"
]

bot.command("working", (ctx) => {
    return ctx.reply(
        `Checking in for ${new Date().toLocaleDateString("en-GB", {
          timeZone: "Asia/Kuala_Lumpur",
        })}`,
        Markup.inlineKeyboard([
          WORK_ACTIONS.map(x => Markup.button.callback(x, x)),
          [Markup.button.callback("Cancel", "cancel")],
        ])
      );
})

function chunk (arr, size) {
    return new Array(Math.ceil(arr.length / size)).fill(null).map(() => arr.splice(0, size));
  }  

bot.command("leave", ctx => {
    return ctx.reply(
        `On leave for ${new Date().toLocaleDateString("en-GB", {
          timeZone: "Asia/Kuala_Lumpur",
        })}`,
        Markup.inlineKeyboard(
            chunk([...LEAVE_ACTIONS.map(x => Markup.button.callback(x, x)), Markup.button.callback("Cancel", "cancel")], 3)
        )
      );
})

bot.on(message('text'), (ctx) =>
  ctx.reply(
    "Oops, I cant't seem to understand this command. p/s: This is a minified version of Tappy, usual commands are disabled as of now. Sorry!"
  )
);

/// LOGIC

bot.action('cancel', ctx => {
    ctx.editMessageText(`Cancelled`)
})

WORK_ACTIONS.forEach(x => {
    let ts = new Date().toISOString()
    bot.action(x, ctx => {
        ctx.editMessageText(`Attendance captured`)
        ctx.replyWithMarkdownV2(
            `Status: ${x}`
          )
        // fs.writeFile('attendance.log', `${ts} ${ctx.from.id} WORKING ${x}\n`, { flag: 'a+' }, err => {});
        Attd.create({'ts': ts, 'pf': ctx.from.id, 'attendance':x}).catch(error => error)
    })
})

LEAVE_ACTIONS.forEach(x => {
    let ts = new Date().toISOString()
    bot.action(x, ctx => {
        ctx.editMessageText(`Attendance captured`)
        ctx.replyWithMarkdownV2(
            `Status: ${x}`
          )
        // fs.writeFile('attendance.log', `${ts} ${ctx.from.id} LEAVE ${x}\n`, { flag: 'a+' }, err => {});
        Attd.create({'ts': ts, 'pf': ctx.from.id, 'attendance':x}).catch(error => error)
    })
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
