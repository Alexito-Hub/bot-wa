const GroupConfig = require('../models/_antilink');

async function antilinkMiddleware(sock, m, next) {
    try {
        if (!m.isGroup) {
            next();
            return;
        }

        const groupId = m.chat;
        const groupConfig = await GroupConfig.findOne({ groupId });

        const linkRegex = /(?:^|\s)((?:https?|ftp):\/\/[\n\S]+)|(?:^|\s)(www\.[\S]+)|(?:^|\s)([\w]+\.[\S]+)|(?:^|\s)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d{1,5})?\/?\S*)|(?:^|\s)((?:https?|ftp):\/\/(?:www\.)?[\w-]+\.[\w]{2,20}(?:\.[\w]{2,20})+(?:\/[\w-]+)*\/?)/gi;
        const containsLink = linkRegex.test(m.body);

        if (groupConfig && groupConfig.antilink && containsLink) {
            await sock.sendMessage(m.chat,  { delete: m.key });
            await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            await sock.sendMessage(m.chat, { text: 'Enlaces no permitidos. Has sido eliminado.' });
        } else {
            next();
        }
    } catch (error) {
        console.error('Error en el middleware antilink:', error);
        await sock.sendMessage(m.chat, { text: 'Ocurrió un error al procesar tu solicitud.' });
    }
}

module.exports = antilinkMiddleware;
