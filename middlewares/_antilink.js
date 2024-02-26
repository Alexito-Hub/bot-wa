const GroupConfig = require('../models/_antilink');

async function antilinkMiddleware(sock, m, next, isBotAdmin, isAdmin) {
    if (!m.isGroup) {
        next();
        return;
    }

    const groupId = m.chat;
    const groupConfig = await GroupConfig.findOne({ groupId });


    const containsLink = /(http|https):\/\/\S+|www\.\S+|\S+\.\S+/i.test(m.body);
    if (containsLink && groupConfig) {
        if (isBotAdmin) {
            if (isAdmin) {
                v.reply("es un admin, no lo puedo funar")
            } else {
                if (groupConfig && groupConfig.antilink) {
                    await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await sock.sendMessage(m.chat, { text: 'Enlaces no permitidos. Has sido eliminado.' });
                }
            }
            return
        } else {
            v.reply("nosoyadmin")
            return
        }
    } else {
        return
        }

    next();
}

module.exports = antilinkMiddleware;
