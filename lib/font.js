const fs = require('fs');
const path = require('path');
const cfonts = require('cfonts');
const axios = require('axios');

const ANIMATION_INTERVAL = 120;
const MESSAGE_LIMIT = 80;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function banner() {
    const bannerConfig = {
        font: 'simple',
        align: 'center',
        gradient: ['green', 'blue']
    };
    return cfonts.render("I'm ziooo", bannerConfig).string;
}

function copyright() {
    const copyrightConfig = {
        font: 'console',
        align: 'center',
        gradient: ['yellow', 'green']
    };
    return cfonts.render('All rights reserved|@zio', copyrightConfig).string;
}

function loading(text) {
    const loadingConfig = {
        font: "console",
        align: "center"
    }
    return cfonts.render('Bienvenido a la base de Ziooo', loadingConfig).string
}

const spinnerFrames = [
    '🕐 ',
    '🕑 ',
    '🕒 ',
    '🕓 ',
    '🕔 ',
    '🕕 ',
    '🕖 ',
    '🕗 ',
    '🕘 ',
    '🕙 ',
    '🕚 ',
    '🕛 '];

let globalSpinner;

const getGlobalSpinner = () => {
    if (!globalSpinner) {
        let currentFrame = 0;
        let interval;
        globalSpinner = {
            start: (text) => {
                process.stdout.write(text + ' ' + spinnerFrames[currentFrame]);
                interval = setInterval(() => {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    currentFrame = (currentFrame + 1) % spinnerFrames.length;
                    process.stdout.write(text + ' ' + spinnerFrames[currentFrame]);
                }, ANIMATION_INTERVAL);
            },
            succeed: (text) => {
                clearInterval(interval);
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                console.log(text);
            }
        };
    }
    return globalSpinner;
};

function splitMessage(text, limit = MESSAGE_LIMIT) {
    const chunks = [];
    while (text.length > 0) {
        if (text.length <= limit) {
            chunks.push(text);
            break;
        }
        const currentChunk = text.slice(0, limit);
        chunks.push(currentChunk);
        text = text.slice(limit);
    }
    return chunks;
}

function getProgressBar(percentage) {
    const progressBarLength = 20;
    const filledBlocks = Math.floor(percentage / (100 / progressBarLength));
    const emptyBlocks = progressBarLength - filledBlocks;

    const filled = '■'.repeat(filledBlocks);
    const empty = '▢'.repeat(emptyBlocks);

    return `${filled}${empty} ${percentage}%
Verificando paquetes requeridos`;
}

function progressBar(duration) {
    const interval = 1000; // intervalo en milisegundos (1 segundo en este caso)
    const totalIntervals = duration / interval;
    
    for (let i = 0; i <= totalIntervals; i++) {
        const percentage = (i / totalIntervals) * 100;
        const progressBar = getProgressBar(percentage);
        setTimeout(() => {
            console.clear();
            console.log(progressBar)
        }, i * interval);
        setTimeout(() => {
            console.clear()
            console.log('Completo')
        }, duration)
        setTimeout(() => {
            const start = banner() + copyright()
            console.clear()
            console.log(start)
        }, interval + duration)
    }
}

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


module.exports = {
    banner,
    loading,
    copyright,
    progressBar,
    splitMessage,
    statusSession,
    getProgressBar,
    getGlobalSpinner
};
