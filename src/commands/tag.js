const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'tag',
    description: 'Envía un mensaje y multimedia a todos los grupos',
    command: ["tag"],
    
    async execute(sock, m, args) {
        try {
            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);

            const messageType = args.join(' ');
            if (!messageType) {
                await sock.sendMessage(m.chat, { text: '¿Falta de ideas para un mensaje?' }, { quoted: m });
                return;
            }

            const mediaType = m.type === 'imageMessage' ? 'image' : 'video';
            const mediaKey = m[`${mediaType}Message`].mediaKey;

            const buffer = await getFileBuffer(mediaKey, m.type);

            if (buffer) {
                for (const groupId of groupIds) {
                    await sleep(1500);

                    await sock.sendMessage(groupId, {
                        [mediaType]: { url: m[`${mediaType}Message`].url },
                        mimetype: m[`${mediaType}Message`].mimetype,
                        caption: messageType,
                        contextInfo: { remoteJid: groupId },
                    });
                }
                await sock.sendMessage(m.chat, { text: 'Envío de contenido correcto.' }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, { text: 'Error al obtener el contenido multimedia.' }, { quoted: m });
            }
        } catch (error) {
            console.error('Error:', error);
            await sock.sendMessage(m.chat, { text: 'Error al enviar contenido' }, { quoted: m });
        }
    },
};


