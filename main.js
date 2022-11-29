require('dotenv').config()
const fs = require('fs');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

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
bot.hears('syamil', (ctx) => ctx.reply('Syamil hensem'))
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

bot.command("leave", ctx => {
    return ctx.reply(
        `On leave for ${new Date().toLocaleDateString("en-GB", {
          timeZone: "Asia/Kuala_Lumpur",
        })}`,
        Markup.inlineKeyboard(
            LEAVE_ACTIONS.map(x => [Markup.button.callback(x, x)]),
            [Markup.button.callback("Cancel", "cancel")],
        )
      );
})

bot.on(message('text'), (ctx) =>
  ctx.reply(
    "Oops, I cant't seem to understand this command. p/s: This is a minified version of Tappy, usual commands are disabled as of now. Sorry!"
  )
);

/// LOGIC

WORK_ACTIONS.forEach(x => {
    let ts = new Date().toISOString()
    bot.action(x, ctx => {
        ctx.editMessageText(`Attendance captured`)
        ctx.replyWithMarkdownV2(
            `Status: ${x}`
          )
        fs.writeFile('attendance.log', `${ts} ${ctx.from.id} WORKING ${x}\n`, { flag: 'a+' }, err => {});
    })
})

LEAVE_ACTIONS.forEach(x => {
    let ts = new Date().toISOString()
    bot.action(x, ctx => {
        ctx.editMessageText(`Attendance captured`)
        ctx.replyWithMarkdownV2(
            `Status: ${x}`
          )
        fs.writeFile('attendance.log', `${ts} ${ctx.from.id} LEAVE ${x}\n`, { flag: 'a+' }, err => {});
    })
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));