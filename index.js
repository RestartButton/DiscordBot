const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const bot = new Discord.Client();
const cooldowns = new Discord.Collection();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(`${config.PREFIX}help`);
});

///lendo as mensagens

bot.on('message', message => {
    
    ///verificando se a mensagem é valida

    if(!message.content.startsWith(config.PREFIX) || message.author.bot) return;

    ///dividindo a mensagem em partes

    const commandBody = message.content.slice(config.PREFIX.length).trim();
    const args = commandBody.split(/ +/);
    const commandName = args.shift().toLowerCase();

    ///verificando se a mensagem possui um comando (seja o nome dele ou um apelido pré definido)

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;

    ///conferindo se o comando necessita de argumentos para funcionar

    if(command.args && !args.length) return message.reply('Você não usou o comando corretamente!');

    ///conferindo se o comando precisa ser executado em um servidor

    if(command.guildOnly && message.channel.type === 'dm') {
        return message.reply('Não posso executar este comando em chat privado');
    }
    
    ///cooldowns

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Por favor espere mais ${timeLeft.toFixed(1)} segundos antes de usar o  comando ${command.name}.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    ///chamando os comandos dinamicamente

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro ao tentar executar este comando!');
    }
});

bot.login(config.TOKEN);