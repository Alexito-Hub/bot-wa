const GroupConfig = require('../models/_antilink');

async function antilinkMiddleware(sock, m, isMe, isAdmin, isBotAdmin) {
    try {
        if (!m.isGroup) return; // Verifica si el mensaje es de un grupo

        const groupId = m.chat;    
        const groupConfig = await GroupConfig.findOne({ groupId });

        if (!groupConfig || !groupConfig.antilink) return; // Verifica si el antienlace está habilitado para el grupo

        const containsLink = /(http|https):\/\/\S+|www\.\S+|\S+\.\S+/i.test(m.body);

        if (containsLink) {
      
                if (!isAdmin && !isMe && !isStaff) {
                    await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    v.reply("Enlaces no permitidos. Has sido eliminado.");
                }

        }
        
    } catch (error) {
        console.error('Error en el middleware anti-enlace:', error);
    }
}

module.exports = antilinkMiddleware;
