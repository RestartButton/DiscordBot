const ytdl = require('ytdl-core');
const url = 'https://www.youtube.com/watch?v=_DYAnU3H7RI'

module.exports = {
    name: 'play',
    description: 'Toca uma playlist de 10 horas de lo-fi no canal de voz que você está conectado.',
    aliases: ['p'],
    guildOnly: true,
    execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) {
            return message.reply('Você precisa estar conectado a um canal de voz para executar este comando.');
        }
        
        if(!message.guild.me.voice.channel || voiceChannel === message.guild.me.voice.channel) {
            voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.play(ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }))
                    
                    dispatcher.on('end', () => {
                        message.guild.me.voice.channel.leave();
                    })

                })
        } else return message.reply('Já estou em outro canal');
        
    }
}