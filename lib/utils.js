const axios = require('axios')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function statusSession(spinner, sessionExists) {
    spinner.start('Verificando sesión...');
    await sleep(1000);

    if (sessionExists) {
        setTimeout(() => {
            spinner.succeed('Sesión existente encontrada.');
        }, 3000)
    } else {
        setTimeout(() => {
            spinner.succeed('No se encontró sesión existente. Escanee el código QR.');
        }, 3000)
    }

    await sleep(3000);
}

exports.fetchJson = async (url, options = {}) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        return err;
    }
};

module.exports = {
    fetchJson,
    statusSession
}