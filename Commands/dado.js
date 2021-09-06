module.exports = {
    name: 'dado',
    description: 'Rola um dado de ´n´ lados',
    aliases: ['d'],
    usage: '[numero de lados]',
    cooldown: 1,
    execute(message, args) {
        const lados = args[0];
        const result = Math.floor(Math.random() * (lados - 1)) + 1;
        message.reply(`O resultado do dado foi ${result}`);
    }
}