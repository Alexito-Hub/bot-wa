const { fetchJson } = require('../../lib/utils')

module.exports = {
    name: 'play2',
    description: 'Descarga videos de YouTube',
    command: ['play2', 'ytplay2', 'ytaudio', 'ytmusic'],

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await sock.sendMessage(m.chat, { text: '*play2 <string>*' }, { quoted: m });
                return;
            }
            await sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });
            const searchText = args.join(' ');

            const searchResults = await fetchJson(`https://api.zioo.space/api/download/ytdl-search?query=${searchText}`);

            if (!searchResults || !searchResults.result || searchResults.result.length === 0) {
                await sock.sendMessage(m.chat, { text: 'No se encontraron resultados.' }, { quoted: m });
                return;
            }
            const result = searchResults.result[0]
            await sock.sendMessage(m.chat, { image: { 
                url: result.Thumbnail },
                mimetype: 'image/jpeg',
                caption:`ㅤ *⋯⋯ YOUTUBE MP3⋯⋯*
 ▢ *Título:* ${result.title}
 ▢ *Autor:* ${result.author.name}
 ▢ *Duración:* ${result.duration.timestamp}
 ▢ *Fecha:* ${result.date}
 ▢ *Descripción:* ${result.description}
 
*implement api@zio*`
            }, {quoted: m})
            await sock.sendMessage(m.chat, { audio: { 
                url: `https://api.zioo.space/api/download/ytdl-mp3?url=${result.url}` }, 
                mimetype: 'audio/mpeg', 
                contextInfo:{
                    externalAdReply:{
                        title:`${result.title}`,
                        body: `${result.author.name}`,
                        thumbnailUrl: result.Thumbnail,
                        sourceUrl: result.url
                    }
                }
            }, {quoted: m})
                await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, { text: 'Error al procesar el comando.' }, { quoted: m });
        }
    },
};
