const { PREFIX } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Lista de todos os comandos ou informação sobre um comando específico.',
    aliases: ['commands'],
    usage: '[nome do comando]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if(!args.length) {
            data.push('Aqui está uma lista de todos os meus comandos:\n');
            data.push(commands.map(command => command.name).join('\n'));
            data.push(`\nVocê pode mandar \"${PREFIX}help [nome do comando]\" para obter informação sobre um comando epecífico!`)

            return message.author.send(data, { split: true })
                .then(() => {
                    if(message.channel.type === 'dm') return;
                    message.reply('Mandei uma DM com todos os meus comandos!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('Parece que não posso te mandar uma DM! Você tem DMs desativadas?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.include(name));

        if(!command) {
            return message.reply(`Não consegui encontrar este comando!`);
        }

        data.push(`Nome: ${command.name}`);

        if(command.aliases) data.push(`Apelidos: ${command.aliases.join(', ')}`);
        if(command.description) data.push(`Descrição: ${command.description}`);
        if(command.usage) data.push(`Uso: ${PREFIX}${command.name} ${command.usage}`);

        data.push(`Cooldown: ${command.cooldown || 3} segundo(s)`);

        message.channel.send(data, { split: true });
    }
}