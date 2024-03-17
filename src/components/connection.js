/* *******************************************************************************************************************
   *
   *    -- CREADO POR ZIOOO --      
   *
   *    IG : im._ziooo
   *    GITHUB : Alexito-Hub
   *
   *    -- PARA USAR --        
   *    $ git clone https://github.com/Alexito-Hub/ziooo-base.git
   *    $ npm install
   *    $ npm start
   *
   *    ¿tienes problemas? Contáctanos
   *    +1 (347) 666-5855
   *    +51 968 374 620
   *
   *******************************************************************************************************************/

require("../database")
const {
     default: makeWASocket,
     DisconnectReason,
     Browsers,
     makeInMemoryStore,
     useMultiFileAuthState,
     fetchLatestBaileysVersion,
     makeCacheableSignalKeyStore,
     getContentType,
 } = require("@whiskeysockets/baileys")

const fs = require("fs")
const pino = require("pino")
const { exec } = require("child_process")

const NodeCache = require('node-cache')
const readline = require('readline')


const msgRetryCounterCache = new NodeCache();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const question = text => new Promise(resolve => rl.question(text, resolve));

const P = require("pino")({
	level: "silent",
});

// const font = require("../../lib/font")


// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.connect = async() => {
    const start = async() => {
        const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" })})
        // const spinner = font.getGlobalSpinner();
        const sessionExists = await fs.promises.access('./auth/session').then(() => true).catch(() => false);
    
        // await font.statusSession(spinner, sessionExists);
        // await sleep(4000)
        const { state, saveCreds } = await useMultiFileAuthState('./auth/session')
        const { version } = await fetchLatestBaileysVersion()
        const sock = makeWASocket({
            version,
            logger: P,
            printQRInTerminal: false,
            browser: Browsers.ubuntu("Chrome"),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P),
            },
            msgRetryCounterCache,
        });

        store?.bind(sock.ev);

        sock.ev.on("creds.update", saveCreds);

        if (!sock.authState.creds.registered) {
            const phoneNumber = await question(colorize.bold("Enter your active whatsapp number: "));
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(colorize.bold(`pairing with this code: ${code}`));
        }
        
        sock.ev.on("connection.update", m => {
            const { connection, lastDisconnect } = m
            
            if (connection === "close") {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log("Error en la conexión:", lastDisconnect.error, "Reconectando:", shouldReconnect);
                if (shouldReconnect) {
                    start();
                } else {
                    exec("rm -rf auth/sesion", (err, stdout, stderr) => {
                        if (err) {
                            console.error("Error al eliminar el archivo de sesión:", err)
                        } else {
                            console.error("Conexión con WhatsApp cerrada. Escanee nuevamente el código QR!")
                            start()
                        }
                    })
                }
            } else if (connection === "open") {
                // const copyright = font.copyright();
                // const progress = font.progressBar(5000);
                // console.log(progress, copyright)
                console.log("oppened connection")
            }
        })
        
        sock.ev.on("creds.update", saveCreds)
    
        sock.ev.on('messages.upsert', messages => {
            messages = messages.messages[0]
            if (!messages) return
            
            messages.message = (getContentType(messages.message) === 'ephemeralMessage') ? messages.message.ephemeralMessage.message : messages.message
            if (messages.key && messages.key.remoteJid === 'status@broadcast') return
            
            require('./loader')(sock, messages)
        })
    
        store.bind(sock.ev)
        return sock
    }
    start()
}