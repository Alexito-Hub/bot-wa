module.exports = {
    name: "Setting Group",
    description: "Ajustes del grupo",
    command: ["group", "grupo"],

    async execute(sock, m, isAdmin, isBotAdmin) {
        if (!m.isGroup) return

        if (isBotAdmin) {
            if (isAdmin) {
                sock.sendMessage(m.chat, { text: 'FUNCIONA, NO LO TOQUES'}, { quoted: m })
            } else {
                sock.sendMessage(m.chat, { text: 'no eres administrador para poder editar las configuraciones del grupo'}, { quoted: m })
                return
            }
        } else {
            sock.sendMessage(m.chat, { text: 'no soy administrador para poder editar las configuraciones del grupo'}, { quoted: m })
            return
        }
        
       


    }
}