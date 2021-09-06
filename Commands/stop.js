module.exports = {
    name: 'stop',
    description: 'Sai do canal de voz.',
    aliases: ['leave'],
    guildOnly: true,
    execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) {
            return message.reply('Você precisa estar conectado a um canal de voz para executar este comando');
        }

        voiceChannel.leave();
    }
}