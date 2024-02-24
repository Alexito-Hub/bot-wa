require("./config")
const fs = require('fs')
const util = require('util')

const { Json, removeAccents } = require('../../lib/functions')

const { client, sms } = require('../../lib/simple')


module.exports = async(sock, m, store) => {
    try {
        sock = client(sock)
        v = await sms(sock, m)

        if (!m.body) return;
        const prefix = global.prefix
        const isCmd = m.body.startsWith(prefix)
        const command = isCmd ? removeAccents(m.body.slice(prefix.length)).trim().split(' ').shift().toLowerCase() : ''
        
        const args = m.body.trim().split(/ +/).slice(1)
        const q = args.join(' ')
        const senderNumber = m.sender.split('@')[0]
        const botNumber = sock.user.id.split(':')[0]
        
        const groupMetadata = m.isGroup ? await sock.groupMetadata(v.chat) : {}
        const groupMembers = m.isGroup ? groupMetadata.participants : []
        const groupAdmins = m.isGroup ? sock.getGroupAdmins(groupMembers) : false
        
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
    
        switch (command) {
            
            case 'zio':
            v.reply('Hola, soy un bot creado con la Base de Zioo')
            break
            
            default:
			if (isOwner) {
				if (v.body.startsWith('=>')) {
					try {
						await v.reply(Json(eval(q)))
					} catch(e) {
						await v.reply(String(e))
					}
				}
			}
        }

        const messageTime = new Date()
        const isGroup = m.isGroup;
        const isPrivate = !m.isGroup;

        // Colores para la consola
        const colors = {
            reset: "\x1b[0m",
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            underscore: "\x1b[4m",
            blink: "\x1b[5m",
            reverse: "\x1b[7m",
            hidden: "\x1b[8m",
            fgBlack: "\x1b[30m",
            fgRed: "\x1b[31m",
            fgGreen: "\x1b[32m",
            fgYellow: "\x1b[33m",
            fgBlue: "\x1b[34m",
            fgMagenta: "\x1b[35m",
            fgCyan: "\x1b[36m",
            fgWhite: "\x1b[37m",
            bgBlack: "\x1b[40m",
            bgRed: "\x1b[41m",
            bgGreen: "\x1b[42m",
            bgYellow: "\x1b[43m",
            bgBlue: "\x1b[44m",
            bgMagenta: "\x1b[45m",
            bgCyan: "\x1b[46m",
            bgWhite: "\x1b[47m"
        };

        // Imprimir información del mensaje en la consola
        console.log(colors.fgYellow + `[Message Number: ${m.pushName}]` + colors.reset);
        console.log(colors.fgCyan + `[Message Type: ${m.type}]` + colors.reset);
        console.log(colors.fgGreen + `[Message Content: ${m.body}]` + colors.reset);
        console.log(colors.fgBlue + `[Message Time: ${messageTime}]` + colors.reset);

        if (isCmd) {
            console.log(colors.fgRed + `[Command Executed]` + colors.reset);
            console.log(colors.fgBlue + `[Command Time: ${messageTime}]` + colors.reset);
        }

        if (isGroup) {
            console.log(colors.fgMagenta + '[Group Message]' + colors.reset);
        } else if (isPrivate) {
            console.log(colors.fgMagenta + '[Private Message]' + colors.reset);
        }
    } catch (e) {
        console.log(e)
    }    
}    