const GroupConfig = require('../models/_antilink');

async function antiLinkMiddleware(sock, m, next, isAdmin) {
    if (!m.isGroup) {
        next();
        return;
    }

    const groupId = m.chat;
    const groupConfig = await GroupConfig.findOne({ groupId });

    // Verificar si el usuario no es un administrador del grupo
    
    if (!isAdmin) {
        next();
        return;
    }

    if (groupConfig && !isMe && groupConfig.antiLinkEnabled && /https?:\/\/\S+/.test(m.body)) {
        await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        await sock.sendMessage(m.chat, { text: 'Enlaces no permitidos. Has sido eliminado.' });
        return;
    }

    next();
}

module.exports = antilinkMiddleware;
