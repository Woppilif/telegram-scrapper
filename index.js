const { Telegraf } = require('telegraf')
const Duden  = require('./duden')

const bot = new Telegraf('1374215031:AAHaGxT0vmTfcFiab-dG-jruYyldyw1IAs8')
bot.start((ctx) => ctx.reply('Welcome'))

bot.command('duden',
    (ctx) => {
        let word = ctx.message.text.split(' ');
        if (word.length < 2){
            ctx.reply("Usage:\n/duden text");
        }
        else
        {
            new Duden().makeRequest(word[1])
                .then(response => ctx.reply(response));
        }
    })

bot.on('inline_query', (ctx) => {
    let comma = ctx.inlineQuery.query.indexOf('.');
    console.log(ctx.inlineQuery.query);
    if (comma > 1)
    {
        let text = ctx.inlineQuery.query.replace('.','');
        var answer = [];
        var count = 1;
        var resp = null;
        var dud = new Duden();
            dud.makeSearchRequest(text)
                .then(response => resp = dud.continueSearchRequest(response))
                .then(resp => {
                    for (var ans of resp) {
                        count++;
                        answer.push({
                            id:count,
                            type: "article",
                            description: ans,
                            title: ans,
                            input_message_content: {
                                message_text: ans,
                                parse_mode: "HTML"
                            },
                        });
                    }
                    return ctx.answerInlineQuery(answer);
                })
        return ;
    }
})

bot.launch()