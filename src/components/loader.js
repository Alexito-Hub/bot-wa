require("./config")

const { Json, removeAccents } = require('../../lib/functions')
const { client, sms } = require('../../lib/simple');
const { fetchJson } = require('../../lib/utils');

const antilinkMiddleware = require('../../middlewares/_antilink');

const fs = require('fs');
const path = require('path');

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, '..', 'commands', file));
    commands.push(command);
}

function getCommands(commandName) {
    return commands.find(cmd => Array.isArray(cmd.command) && cmd.command.includes(commandName));
}


module.exports = async(sock, m, store) => {
    try {
        sock = client(sock)
        v = await sms(sock, m)

        if (!m.body) return;

        const prefixes = global.prefix || ['#'];
		const isCmd = m.body && prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()));
        const command = isCmd ? removeAccents(m.body.slice(prefix.length)).trim().split(' ').shift().toLowerCase() : ''

		
        const args = m.body.trim().split(/ +/).slice(1)
        const q = args.join(' ')
        const senderNumber = m.sender.split('@')[0]
        const botNumber = sock.user.id.split(':')[0]
        
        const groupMetadata = m.isGroup ? await sock.groupMetadata(v.chat) : {}
        const groupMembers = m.isGroup ? groupMetadata.participants : []
        const groupAdmins = m.isGroup ? sock.getGroupAdmins(groupMembers) : false
        const isAdmin = m.isGroup ? groupAdmins.includes(senderNumber + '@s.whatsapp.net') : false;

        const isMe = (botNumber == senderNumber)
        const isBotAdmin = m.isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false
        const isOwner = owner.includes(senderNumber) || isMe
        const isStaff = staff.includes(senderNumber) || isOwner

        
        const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
        const isQuotedMsg = m.quoted ? (m.quoted.type === 'conversation') : false
        const isQuotedImage = m.quoted ? (m.quoted.type === 'imageMessage') : false
        const isQuotedVideo = m.quoted ? (m.quoted.type === 'videoMessage') : false
        const isQuotedSticker = m.quoted ? (m.quoted.type === 'stickerMessage') : false
        const isQuotedAudio = m.quoted ? (m.quoted.type === 'audioMessage') : false
    
        const hasCommandPrefix = m.body && prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()));
        const commandBody = hasCommandPrefix && m.body ? m.body.slice((prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase())) || '').length).trim() : (m.body || '').trim();
        const [commandName, ...commandArgs] = commandBody.split(/ +/);

        const commandInfo = await getCommands(commandName.toLowerCase());
        if (commandInfo) {
            await commandInfo.execute(sock, m, commandArgs, isOwner, q, args, groupAdmins, senderNumber, botNumber, isBotAdmin, isAdmin, isMe);
            return;
        }


        if (isOwner) {
            if (v.body.startsWith('>')) {
                if (q.trim().length > 0) {
                    await v.reply('Procesando...');
                    await v.reply(Json(eval(q)));
                    
                } else {
                    await v.reply('No hay nada que procesar.');
                }
            }
			if (v.body.startsWith('<')) {
                if (q.trim().length > 0) {
                    await v.reply('Procesando...');
                    await v.reply(Json(eval(`(async ()=>{try{${q}}catch(error){await v.reply(String(error))}})();`)))
                } else {
                    await v.reply('No hay nada que procesar.');
                }
			}

		    if (v.body.startsWith('$')) {
                if (q.trim().length > 0) {
                    await v.reply('Procesando...');
                    try {
                        const { exec } = require('child_process');
                        exec(q, (error, stdout, stderr) => {
                            if (error) {
                                sock.sendMessage(m.chat, {text:`${error.message}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}}, {quoted:m});
                                return;
                            }
                            if (stderr) {
                                sock.sendMessage(m.chat, {text:`${stderr}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}
                                }, {quoted:m});
                                return;
                            }
                            sock.sendMessage(m.chat, {text:`${stdout}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}}, {quoted:m});
                        });
                    } catch (e) {
                        sock.sendMessage(m.chat, { text:`${e.message}`, contextInfo: { externalAdReply: {showAdAttribution: true, }}}, {quoted:m});
                    }
                } else {
                    await v.reply('No hay nada que procesar.');
                }
    		}
        }

        antilinkMiddleware(sock, m, () => {});

    } catch (e) {
        console.log(e)
    }    
}    