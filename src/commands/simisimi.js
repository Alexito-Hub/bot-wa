const axios = require('axios');
module.exports = {
    name: 'Simi Simi',
    description: 'Muestra el tiempo de actividad',
    command: ['simisimi', 'bot', 'simi'],
    
    async execute(sock, m, args) {
        if (!args || args.length < 1) {
            await sock.sendMessage(m.chat, { text: 'Por favor, proporciona un mensaje para enviar a SimSimi.' });
            return;
        }
    
        const message = args.join(' '); 
    
        try {
            const response = await axios.post('https://api.simsimi.vn/v1/simtalk', `text=${encodeURIComponent(message)}&lc=es&key=t-9yVoTbJ5jYRZADH-j-Qg4KbX-zoFn5VO6oUx1n`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            await sock.sendMessage(m.chat, { text: response.data.message });
        } catch (error) {
            console.error('Error al enviar mensaje a SimSimi:', error);
            await sock.sendMessage(m.chat, { text: 'Ocurrió un error al enviar el mensaje a SimSimi.' });
        }        
    }
}