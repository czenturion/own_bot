const { default: axios } = require('axios');
const { Telegraf, Markup } = require('telegraf');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    await ctx.reply(ctx.from.first_name + 'Здарова заебал!');

    await ctx.reply('Скинь текущую гео, и получишь там погоду: ',
        Markup.keyboard([
            Markup.button.locationRequest(' 📍 Отправить местоположение ')
        ]).resize()
    )
});

bot.command('/sendLocation', (ctx) => {
    bot.ctx.telegram.sendLocation()
})
bot.on('message', (ctx) => {
    ctx.reply(ctx.message.from.first_name + " пишет: " + ctx.message.text);
    if (ctx.message.location) {
        if (ctx.message.location) {
            const weatherUrl = `https://openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=439d4b8O4bc8187953eb36d2a8c26a02`;

            const res = axios.get(weatherUrl)

            ctx.reply(weatherUrl)
        }
    }
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));