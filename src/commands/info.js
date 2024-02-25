module.exports = {
    name: 'info',
    description: 'Obtener información de los comandos disponibles',
    command: ['info', 'informacion', 'information'],

    async execute(sock, m, getCommands, args, q) {
        try {
            if (!args[0]) {
                await sock.sendMessage(m.chat, { text: '*info <comando>*' }, { quoted: m });
                return;
            }

            const command = getCommands(args[0])

            if (!command) {
                v.reply('comando no encontrado')
                return
            
            }

            v.reply('yei')
            
        } catch (error) {
        }
    }
};
