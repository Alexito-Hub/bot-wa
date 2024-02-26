const fs = require('fs');
const path = require('path');

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, '..', '..', 'src', 'commands')).filter(file => file.endsWith('.js') && file !== 'info.js');

for (const file of commandFiles) {
    const command = require(path.join(__dirname, '..', '..', 'src', 'commands', file));
    commands.push(command);
}

function getCommands(commandName) {
    return commands.find(cmd => Array.isArray(cmd.command) && cmd.command.includes(commandName));
}


module.exports = {
    name: 'info',
    description: 'Obtener información sobre un comando específico',
    command: ['info', 'informacion', 'information'], // Nombre del comando
    async execute(sock, m, args, isOwner) {
        try {
            const query = args.join(' ').toLowerCase();

            if (!query) {
                await sock.sendMessage(m.chat, { text: '*- info <command>*' }, { quoted: m });
                return
            }
            let commandInfo = getCommands(query);

            if (!commandInfo) {
                await sock.sendMessage(m.chat, { text: '*[?]* Comando no encontrado.' }, { quoted: m });
                return;
            }


            await sock.sendMessage(m.chat, { text: `
*Nombre:* ${commandInfo.name}
*Descripción:* ${commandInfo.description}
*Comandos:* ${commandInfo.command.join(', ')}` }, { quoted: m });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, { text: '[!] Error al obtener la información del comando.' }, { quoted: m });
        }
    },
};
