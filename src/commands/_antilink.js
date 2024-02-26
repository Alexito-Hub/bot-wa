const GroupConfig = require('../../models/_antilink');

module.exports = {
    name: 'antienlace',
    description: 'Habilita o deshabilita el anti-enlace en el grupo',
    command: ['antienlace', 'antilink'],
    async execute(sock, m, args, isOwner, isBotAdmin) {
        if (!m.isGroup) {
            await sock.sendMessage(m.chat, { text: 'Este comando solo se puede usar en grupos.' }, { quoted: m });
            return;
        }

        const groupId = m.chat;
        let groupConfig = await GroupConfig.findOne({ groupId });

        if (!groupConfig) {
            groupConfig = new GroupConfig({ groupId });
        }

        if (args[0] === 'on') {
            groupConfig.antilink = true;
            await groupConfig.save();
            await sock.sendMessage(m.chat, { text: 'Anti-enlace habilitado para este grupo.' }, { quoted: m });
        } else if (args[0] === 'off') {
            groupConfig.antilink = false;
            await groupConfig.save();
            await sock.sendMessage(m.chat, { text: 'Anti-enlace deshabilitado para este grupo.' }, { quoted: m });
        } else {
            await sock.sendMessage(m.chat, { text: 'Uso: !antienlace [on|off]' }, { quoted: m });
        }
    },
};
