import axios from 'axios';
import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    await ctx.reply(ctx.from.first_name + ', здарова заебал!');

    await ctx.reply('Скинь текущую гео, и получишь там погоду: ',
        Markup.keyboard([
            Markup.button.locationRequest(' 📍 Отправить местоположение ')
        ]).resize()
    );
});

bot.on('message', async (ctx) => {

    console.log(ctx.message)
    console.log(JSON.stringify(ctx.message, null, 2))

    if (ctx.message.location) {

        console.log('гео поолучено')

        const lat = ctx.message.location.latitude;
        const lon = ctx.message.location.longitude;

        const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m&timezone=auto`;

        try {
            console.log('запрос погоды')
            const weatherRes = await axios.get(weatherUrl);
            console.log('декод гео')
            const geoRes = await axios.get(geoUrl);

            const address = geoRes.data.address;
            const locationName = address.city || address.town || address.village || address.municipality || 'вашем районе';

            const current = weatherRes.data.current;

            const weatherMessage = `
            🌤 Погода в ${locationName}:
            • Температура сейчас: ${current.temperature_2m}°C
            • Скорость ветра: ${current.wind_speed_10m} км/ч
        `;

            ctx.reply(weatherMessage);
        } catch (e) {
            console.log('Ошибка при запросе: ', e);
            ctx.reply('Бля, чет ошибка упала, попробуй позже(');
        };
    } else {
        ctx.reply('Функционал для простых сообщений андер девелопмент...');
    };
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));