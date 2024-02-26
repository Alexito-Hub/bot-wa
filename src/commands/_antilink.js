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

        const enable = ['on', 'open', 'enable', 'habilitar'].includes(args[0]?.toLowerCase())
        const disable = ['off', 'close', 'disable', 'deshabilitar'].includes(args[0]?.toLowerCase())


        if (enable) {
            if (groupConfig.antilink) {
                await sock.sendMessage(m.chat, { text: 'El anti-enlace ya está habilitado en este grupo.' }, { quoted: m });
            } else {
                groupConfig.antilink = true;
                await groupConfig.save();
                await sock.sendMessage(m.chat, { text: 'Anti-enlace habilitado para este grupo.' }, { quoted: m });
            }
        } else if (disable) {
            if (!groupConfig.antilink) {
                await sock.sendMessage(m.chat, { text: 'El anti-enlace ya está deshabilitado en este grupo.' }, { quoted: m });
            } else {
                groupConfig.antilink = false;
                await groupConfig.save();
                await sock.sendMessage(m.chat, { text: 'Anti-enlace deshabilitado para este grupo.' }, { quoted: m });
            }
        } else {
            await sock.sendMessage(m.chat, { text: 'Uso: !antienlace [on|off]' }, { quoted: m });
        }

    },
};
