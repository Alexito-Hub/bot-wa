const GroupConfig = require('../models/_antilink');

async function antilinkMiddleware(sock, m, next, isBotAdmin, isAdmin) {
    if (!m.isGroup) {
        next();
        return;
    }

    const groupId = m.chat;
    const groupConfig = await GroupConfig.findOne({ groupId });


    const containsLink = /(http|https):\/\/\S+|www\.\S+|\S+\.\S+/i.test(m.body)
    if (groupConfig && groupConfig.antilink) {
        await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        await sock.sendMessage(m.chat, { text: 'Enlaces no permitidos. Has sido eliminado.' })
    }
}

module.exports = antilinkMiddleware;
