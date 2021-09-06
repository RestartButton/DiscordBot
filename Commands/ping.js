module.exports = {
    name: 'ping',
    description: 'Pong! Mostra a latência das mensagens.',
    cooldown: 5,
    execute(message, args) {
        const timeTaken = message.createdTimestamp - Date.now();
        message.reply(`Pong, esta mensagem teve uma latência de ${timeTaken}ms.`);
    }
}