const moment = require('moment-timezone');
const mongoose = require('mongoose');
const os = require('os')
const fs = require('fs')

const { fetchJson } = require('../../lib/utils');

const getGreeting = () => {
    const currentHour = moment().tz('America/Lima').format('H');
    let greeting, dailyMessage;

    if (currentHour >= 5 && currentHour < 12) {
        greeting = '¡Buenos días!';
        dailyMessage = 'Es un nuevo día para alcanzar tus metas. ¡Vamos!';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = '¡Buenas tardes!';
        dailyMessage = 'La tarde es perfecta para seguir progresando. ¡No te detengas!';
    } else if (currentHour >= 18 && currentHour < 24) {
        greeting = '¡Buenas noches!';
        dailyMessage = 'Descansa y recarga energías para un nuevo día de logros.';
    } else {
        greeting = '¡Buenas madrugadas!';
        dailyMessage = 'Aunque sea temprano, cada hora cuenta. ¡Sigue adelante!';
    }

    return { greeting, dailyMessage, time: moment().tz('America/Lima').format('h:mm A') };
};

function countFilesInFolder(folderPath) {
    return new Promise((resolve, reject) => {
        // Leer el contenido de la carpeta
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            // Filtrar solo archivos, no directorios
            const filesOnly = files.filter(file => fs.statSync(`${folderPath}/${file}`).isFile());
            resolve(filesOnly.length);
        });
    });
}

function formatSize(sizeInBytes) {
    const KB = 1024;
    const MB = KB * 1024;

    if (sizeInBytes >= MB) {
        return `${(sizeInBytes / MB).toFixed(2)} MB`;
    } else {
        return `${(sizeInBytes / KB).toFixed(0)} KB`;
    }
}

function getOperatingSystem() {
    return os.platform();
}

module.exports = {
    name: 'Menu',
    description: 'Muestra un menú de comandos',
    command: ['menu', 'commands', 'comandos'],

    async execute(sock, m, ) {
        try {

            const nodeVersion = process.version;
            const osType = getOperatingSystem()
            const dbStats = await mongoose.connection.db.stats();
            const countDb = formatSize(dbStats.storageSize)
            const filesOnly = await countFilesInFolder('./src/commands');

            const user = m.sender.split('@')[0];
            const prefixList = global.prefix.map(p => `[ ${p} ]`).join(' ');

            const uptimeSeconds = Math.floor(process.uptime());
            const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
            const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
            const seconds = uptimeSeconds % 60;

            const { greeting, dailyMessage, time } = getGreeting();
            await sock.sendMessage(m.chat, {
                contextInfo: {
                    remoteJid: m.chat,
                    mentionedJid: [m.sender]
                },
                video:{url:'https://telegra.ph/file/55346adaf81c8923de948.mp4'},
                gifPlayback: true,
                caption: `    ${greeting} *@${user} 🍥*
᳃ *"${dailyMessage}"*

  *∘ Prefijo:* ${prefixList}
  *∘ Comandos:* ${filesOnly}
  *∘ Modo:* Público
  *∘ Uptime:* ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s
  *∘ Creador:* @zioo
  *∘ Version:* 1.2.0
  *∘ MongoDB:* ${countDb}
  *∘ Node.js:* ${nodeVersion}
  *∘ SO:* ${osType}
  *∘ Developer:* @zioo
  *∘ GitHub:* https://github.com/Alexito-Hub/ziooo-base
  *∘ Api Web:* https://api.zioo.space

Para obtener información de algún comando usa "Help <command>"
 
 *• ⋯⋯ DOWNLOADS ⋯⋯ •*
 ➵ tiktok *<url>*
 ➵ play *<tring>*
 ➵ ytmp3 *<url>*

 *• ⋯⋯ OWNER ⋯⋯ •*
 ➵ promote *<user>*
 ➵ demote *<user>*
 ➵ remove *<user>*
 ➵ hidetag *<string>
 
 *• ⋯⋯ DEV ⋯⋯ •*
 ➵ run
 ➵ $ 
 ➵ >
 ➵ <

Obten información basica del bot con !info

*todos los derechos reservados @zioo*`
            })
        } catch (error) {
            console.error('Error en la ejecución del comando menu:', error);
        }
    }
};

/*
await sock.sendMessage(m.chat, {
                text,
                contextInfo: {
                    remoteJid:m.chat,
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `Hora: ${time}`,
                        sourceUrl: `https://whatsapp.com/channel/0029VaBQgoGLdQehR6vmiY42`,
                        renderLargerThumbnail: false,
                        mediaType: 1,
                        thumbnailUrl: 'https://telegra.ph/file/ae78c6675b0f413a5c635.jpg'
                    }
                }
            });
            */