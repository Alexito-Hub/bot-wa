const { fetchJson } = require('../../lib/utils')

module.exports = {
    name: 'play',
    description: 'Descarga videos de YouTube',
    command: ['play', 'ytplay', 'ytvideo', 'playvideo'],

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await sock.sendMessage(m.chat, { text: '*play <string>*' }, { quoted: m });
                return;
            }
            
            await sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });
            const searchText = args.join(' ');
            const searchResults = await fetchJson(`https://api.zioo.space/api/download/ytdl-search?url=${searchText}`);
            
            if (!searchResults || !searchResults.result || searchResults.result.length === 0) {
                await sock.sendMessage(m.chat, { text: 'No se encontraron resultados.' }, { quoted: m });
                return;
            }
            const result = searchResults.result[0]
            await sock.sendMessage(m.chat, { video: { url: `https://api.zioo.space/api/download/ytdl-mp4?url=${result.url}`},
                mimetype: 'video/mp4',
                caption:`ㅤ *⋯⋯ YOUTUBE MP4 ⋯⋯*
 ▢ *Título:* ${result.title}
 ▢ *Autor:* ${result.author.name}
 ▢ *Duración:* ${result.duration.timestamp}
 ▢ *Fecha:* ${result.date}
 ▢ *Descripción:* ${result.description}
 
*implement api@zio*`
            })
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, { text: 'Error al procesar el comando.' }, { quoted: m });
        }
    },
};
