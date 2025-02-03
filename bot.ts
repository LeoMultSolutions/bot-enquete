// import { BaileysClass } from '../lib/baileys.js';

// let botBaileys = new BaileysClass({
//     timeout: 200000, // Aumenta o timeout para 200 segundos
// });

// botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
// botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
// botBaileys.on('ready', async () => console.log('BOT PRONTO'));

// // Adicione o manipulador de desconexão aqui
// botBaileys.on('disconnected', async () => {
//     console.log('Bot desconectado. Tentando reiniciar...');
//     botBaileys = new BaileysClass({
//         timeout: 200000,
//     });
//     setupBotEvents(botBaileys);
// });

// function setupBotEvents(bot) {
//     bot.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
//     bot.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
//     bot.on('ready', async () => console.log('BOT PRONTO'));
// }

// setupBotEvents(botBaileys);

// let userState = {}; // Armazena os estados dos usuários

// const serviceResponses = {
//     'criação de sites': 'Ótimo! Vamos discutir como podemos criar um site que atenda às suas necessidades.',
//     'gestão de tráfego': 'Perfeito! Vamos trabalhar em estratégias para aumentar o tráfego do seu site.',
//     'entretenimento': 'Legal! Vamos ver como podemos oferecer soluções divertidas para você.',
//     'já sou cliente': 'Que bom tê-lo de volta! Vamos verificar como podemos ajudar você novamente.'
// };

// const serviceQuestions = {
//     'criação de sites': [
//         'Você já possui algum conteúdo ou ideia de design para o site?',
//         'Quantas páginas você imagina que o site terá?',
//         'Precisa de funcionalidades específicas, como formulários de contato ou galerias de imagens?',
//         'Tem alguma preferência por cores ou estilos de design?',
//         'Qual o prazo estimado para concluir o projeto?'
//     ],
//     'gestão de tráfego': [
//         'Qual é o seu público-alvo e onde você espera alcançá-los?',
//         'Já possui algum material publicitário ou conteúdo para campanhas?',
//         'Você está utilizando alguma ferramenta de análise de dados atualmente?',
//         'Qual é o orçamento mensal que você gostaria de investir em anúncios?',
//         'Quais são suas metas principais (aumentar vendas, leads, visitas)?'
//     ],
//     'entretenimento': [
//         'Que tipo de entretenimento você está buscando (eventos, jogos, conteúdo digital)?',
//         'Você já possui uma ideia ou conceito para o projeto?',
//         'Quais plataformas você gostaria de utilizar para a divulgação?',
//         'Tem um público-alvo específico em mente?',
//         'Qual é o prazo para a realização do projeto?'
//     ],
//     'já sou cliente': [
//         'Como tem sido sua experiência até agora?',
//         'Existe algum serviço específico que você gostaria de discutir ou melhorar?',
//         'Você tem novas necessidades ou solicitações desde a última vez que falamos?',
//         'Qual é o seu feedback sobre os serviços que você já recebeu?',
//         'Como podemos ajudar você a atingir seus novos objetivos?'
//     ]
// };

// async function sendWithRetry(to, message, retries = 3) {
//     for (let i = 0; i < retries; i++) {
//         try {
//             await botBaileys.sendText(to, message);
//             return;
//         } catch (error) {
//             console.error(`Erro ao enviar mensagem para ${to}: ${error.message}`);
//             if (i < retries - 1) {
//                 console.log(`Tentativa ${i + 1} falhou. Retentando...`);
//                 await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de tentar novamente
//             } else {
//                 console.error(`Todas as tentativas de envio falharam para ${to}.`);
//                 throw error;
//             }
//         }
//     }
// }

// botBaileys.on('message', async (message) => {
//     const senderId = message.from;

//     if (senderId.endsWith('@g.us')) {
//         return;
//     }

//     console.log(`📩 Mensagem de usuário recebida de ${senderId}`);
//     const user = userState[senderId] || { stage: 'initial', menuShown: false };
//     userState[senderId] = user;

//     if (!message.body) {
//         console.log(`📭 Mensagem sem corpo recebida de ${senderId}`);
//         return;
//     }

//     if (user.stage === 'initial') {
//         const imagePath = 'C:\\bot-wa-baileys\\examples\\imagens\\suporte.png';
//         await botBaileys.sendImage(senderId, imagePath, 'Por favor, aguarde um momento enquanto preparamos as opções do Menu.');

//         setTimeout(async () => {
//             await showInitialMenu(senderId);
//             userState[senderId].menuShown = true;
//             userState[senderId].stage = 'awaitingService';
//         }, 3000);
//     } else if (user.stage === 'awaitingService') {
//         const command = message.body.toLowerCase().trim();

//         if (['criação de sites', 'gestão de tráfego', 'entretenimento', 'já sou cliente'].includes(command)) {
//             userState[senderId].service = command;

//             const response = serviceResponses[command];
//             console.log(`💬 Resposta enviada para ${senderId}: ${response}`);
//             await botBaileys.sendText(senderId, response);

//             if (!userState[senderId].name) {
//                 console.log(`📛 Perguntando nome para ${senderId}`);
//                 await botBaileys.sendText(senderId, `Antes de continuarmos, como posso chamar você?`);
//                 userState[senderId].stage = 'awaitingName';
//             } else {
//                 const { name, service } = userState[senderId];
//                 console.log(`👤 Nome já conhecido para ${senderId}: ${name}`);
//                 await botBaileys.sendText(senderId, `Ok, ${name}! Vamos continuar com seu atendimento sobre ${service}.`);

//                 userState[senderId].stage = 'awaitingDetails';
//                 userState[senderId].details = {};

//                 const questions = serviceQuestions[service];
//                 userState[senderId].currentQuestionIndex = 0;
//                 await botBaileys.sendText(senderId, questions[0]);
//             }
//         } else {
//             console.log(`🔄 Reexibindo menu inicial para ${senderId}`);
//             await showInitialMenu(senderId);
//         }
//     } else if (user.stage === 'awaitingName') {
//         userState[senderId].name = message.body.trim();
//         const { name, service } = userState[senderId];

//         console.log(`👤 Nome recebido de ${senderId}: ${name}`);
//         await botBaileys.sendText(senderId, `Ok, ${name}! Vamos começar seu atendimento sobre ${service}.`);

//         userState[senderId].stage = 'awaitingDetails';
//         userState[senderId].details = {};

//         const questions = serviceQuestions[service];
//         userState[senderId].currentQuestionIndex = 0;
//         await botBaileys.sendText(senderId, questions[0]);
//     } else if (user.stage === 'awaitingDetails') {
//         const { service } = userState[senderId];
//         const questions = serviceQuestions[service];
//         const currentQuestionIndex = userState[senderId].currentQuestionIndex;

//         userState[senderId].details[questions[currentQuestionIndex]] = message.body.trim();

//         if (currentQuestionIndex < questions.length - 1) {
//             userState[senderId].currentQuestionIndex++;
//             await botBaileys.sendText(senderId, questions[userState[senderId].currentQuestionIndex]);
//         } else {
//             await finalizeDetails(senderId);
//         }
//     } else if (user.stage === 'awaitingContactConfirmation') {
//         const command = message.body.toLowerCase().trim();
//         if (command === 'menu') {
//             console.log(`🔄 Reiniciando fluxo para ${senderId}`);
//             userState[senderId].stage = 'awaitingService';
//             userState[senderId].details = {};
//             await showInitialMenu(senderId);
//         } else {
//             console.log(`📭 Mensagem ignorada de ${senderId}: ${message.body}`);
//         }
//     }
// });

// async function showInitialMenu(senderId) {
//     await botBaileys.sendPoll(senderId, '👋 Obrigado por entrar em contato com o Leonardo\r\n```Mult Solutions.```\r\n', {
//         options: ['Criação de Sites', 'Gestão de Tráfego', 'Entretenimento', 'Já sou cliente'],
//         multiselect: false
//     });
// }

// async function finalizeDetails(senderId) {
//     const imagePath = 'C:\\bot-wa-baileys\\examples\\imagens\\suporte.png'; // Defina a variável aqui
//     const { name, service, details } = userState[senderId];
//     const formattedNumber = senderId.replace('@c.us', '');
//     const whatsappLink = `https://wa.me/${formattedNumber}`;

//     const detalhesFormatados = `
//         *Nome:* ${name}
//         *Serviço:* ${service}
//         *Detalhes:*
//         ${Object.entries(details).map(([question, answer]) => `- *${question}*: ${answer}`).join('\n')}
//     `;

//     try {
//         await botBaileys.sendImage(senderId, imagePath, `*Pronto! Seu contato já foi encaminhado para o Leonardo,* se precisar de alguma informação basta digitar (MENU)`);
//         await sendWithRetry('5585996476936@c.us', `*Cliente:* ${whatsappLink}\n*Solicitando atendimento*\n\n${detalhesFormatados}`);
//         console.log(`📤 Detalhes enviados com sucesso para o atendente.`);
//     } catch (error) {
//         console.error(`❌ Falha ao encaminhar detalhes: ${error.message}`);
//     }

//     userState[senderId].stage = 'awaitingContactConfirmation';
// }




import { BaileysClass } from '../lib/baileys.js';

let botBaileys = new BaileysClass({
    timeout: 200000, // Aumenta o timeout para 200 segundos
});

botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('BOT PRONTO'));

// Adicione o manipulador de desconexão aqui
botBaileys.on('disconnected', async () => {
    console.log('Bot desconectado. Tentando reiniciar...');
    botBaileys = new BaileysClass({
        timeout: 200000,
    });
    setupBotEvents(botBaileys);
});

function setupBotEvents(bot) {
    bot.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
    bot.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
    bot.on('ready', async () => console.log('BOT PRONTO'));
}

setupBotEvents(botBaileys);

let userState = {}; // Armazena os estados dos usuários

const serviceResponses = {
    'criação de sites': 'Ótimo! Vamos discutir como podemos criar um site que atenda às suas necessidades.',
    'gestão de tráfego': 'Perfeito! Vamos trabalhar em estratégias para aumentar o tráfego do seu site.',
    'entretenimento': 'Legal! Vamos ver como podemos oferecer soluções divertidas para você.',
    'já sou cliente': 'Que bom tê-lo de volta! Vamos verificar como podemos ajudar você novamente.'
};

const serviceQuestions = {
    'criação de sites': [
        'Você já possui algum conteúdo ou ideia de design para o site?',
        'Quantas páginas você imagina que o site terá?',
        'Precisa de funcionalidades específicas, como formulários de contato ou galerias de imagens?',
        'Tem alguma preferência por cores ou estilos de design?',
        'Qual o prazo estimado para concluir o projeto?'
    ],
    'gestão de tráfego': [
        'Qual é o seu público-alvo e onde você espera alcançá-los?',
        'Já possui algum material publicitário ou conteúdo para campanhas?',
        'Você está utilizando alguma ferramenta de análise de dados atualmente?',
        'Qual é o orçamento mensal que você gostaria de investir em anúncios?',
        'Quais são suas metas principais (aumentar vendas, leads, visitas)?'
    ],
    'entretenimento': [
        'Que tipo de entretenimento você está buscando (eventos, jogos, conteúdo digital)?',
        'Você já possui uma ideia ou conceito para o projeto?',
        'Quais plataformas você gostaria de utilizar para a divulgação?',
        'Tem um público-alvo específico em mente?',
        'Qual é o prazo para a realização do projeto?'
    ],
    'já sou cliente': [
        'Como tem sido sua experiência até agora?',
        'Existe algum serviço específico que você gostaria de discutir ou melhorar?',
        'Você tem novas necessidades ou solicitações desde a última vez que falamos?',
        'Qual é o seu feedback sobre os serviços que você já recebeu?',
        'Como podemos ajudar você a atingir seus novos objetivos?'
    ]
};

async function sendWithRetry(to, message, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await botBaileys.sendText(to, message);
            return;
        } catch (error) {
            console.error(`Erro ao enviar mensagem para ${to}: ${error.message}`);
            if (i === retries - 1) {
                throw error;
            }
        }
    }
}


async function sendDelayedMessage(senderId, message, delay = 2000) {
    // Indica que está digitando
    await botBaileys.sendPresenceUpdate('composing', senderId);

    // Delay antes do envio
    setTimeout(async () => {
        await botBaileys.sendText(senderId, message);
    }, delay);
}

botBaileys.on('message', async (message) => {
    const senderId = message.from;

    if (senderId.endsWith('@g.us')) {
        return;
    }

    console.log(`📩 Mensagem de usuário recebida de ${senderId}`);
    const user = userState[senderId] || { stage: 'initial', menuShown: false };
    userState[senderId] = user;

    if (!message.body) {
        console.log(`📭 Mensagem sem corpo recebida de ${senderId}`);
        return;
    }

    async function sendDelayedMessage(recipient, text, delay = 2000) {
        botBaileys.sendPresenceUpdate('composing', recipient); // Bot mostra "digitando"
        await new Promise(resolve => setTimeout(resolve, delay)); // Delay configurado
        botBaileys.sendPresenceUpdate('paused', recipient); // Para de mostrar "digitando"
        await botBaileys.sendText(recipient, text);
    }

    if (user.stage === 'initial') {
        const imagePath = 'C:\\bot-wa-baileys\\examples\\imagens\\suporte.png';
        await botBaileys.sendImage(senderId, imagePath, 'Por favor, aguarde um momento enquanto preparamos as opções do Menu.');

        setTimeout(async () => {
            await showInitialMenu(senderId);
            userState[senderId].menuShown = true;
            userState[senderId].stage = 'awaitingService';
        }, 3000);
    } else if (user.stage === 'awaitingService') {
        const command = message.body.toLowerCase().trim();

        if (['criação de sites', 'gestão de tráfego', 'entretenimento', 'já sou cliente'].includes(command)) {
            userState[senderId].service = command;

            const response = serviceResponses[command];
            console.log(`💬 Resposta enviada para ${senderId}: ${response}`);
            await sendDelayedMessage(senderId, response, 1500);

            if (!userState[senderId].name) {
                console.log(`📛 Perguntando nome para ${senderId}`);
                await sendDelayedMessage(senderId, `Antes de continuarmos, como posso chamar você?`, 1000);
                userState[senderId].stage = 'awaitingName';
            } else {
                const { name, service } = userState[senderId];
                console.log(`👤 Nome já conhecido para ${senderId}: ${name}`);
                await sendDelayedMessage(senderId, `Ok, ${name}! Vamos continuar com seu atendimento sobre ${service}.`, 1500);

                userState[senderId].stage = 'awaitingDetails';
                userState[senderId].details = {};

                const questions = serviceQuestions[service];
                userState[senderId].currentQuestionIndex = 0;
                await sendDelayedMessage(senderId, questions[0], 1500);
            }
        } else {
            console.log(`🔄 Reexibindo menu inicial para ${senderId}`);
            await showInitialMenu(senderId);
        }
    } else if (user.stage === 'awaitingName') {
        userState[senderId].name = message.body.trim();
        const { name, service } = userState[senderId];

        console.log(`👤 Nome recebido de ${senderId}: ${name}`);
        await sendDelayedMessage(senderId, `Ok, ${name}! Vamos começar seu atendimento sobre ${service}.`, 1500);

        userState[senderId].stage = 'awaitingDetails';
        userState[senderId].details = {};

        const questions = serviceQuestions[service];
        userState[senderId].currentQuestionIndex = 0;
        await sendDelayedMessage(senderId, questions[0], 1500);
    } else if (user.stage === 'awaitingDetails') {
        const { service } = userState[senderId];
        const questions = serviceQuestions[service];
        const currentQuestionIndex = userState[senderId].currentQuestionIndex;

        userState[senderId].details[questions[currentQuestionIndex]] = message.body.trim();

        if (currentQuestionIndex < questions.length - 1) {
            userState[senderId].currentQuestionIndex++;
            await sendDelayedMessage(senderId, questions[userState[senderId].currentQuestionIndex], 1500);
        } else {
            await finalizeDetails(senderId);
        }
    } else if (user.stage === 'awaitingContactConfirmation') {
        const command = message.body.toLowerCase().trim();
        if (command === 'menu') {
            console.log(`🔄 Reiniciando fluxo para ${senderId}`);
            userState[senderId].stage = 'awaitingService';
            userState[senderId].details = {};
            await showInitialMenu(senderId);
        } else {
            console.log(`📭 Mensagem ignorada de ${senderId}: ${message.body}`);
        }
    }
});

async function showInitialMenu(senderId) {
    await botBaileys.sendPoll(senderId, '👋 Obrigado por entrar em contato com o Leonardo\r\n```Mult Solutions.```\r\n', {
        options: ['Criação de Sites', 'Gestão de Tráfego', 'Entretenimento', 'Já sou cliente'],
        multiselect: false
    });
}

async function finalizeDetails(senderId) {
    const { name, service, details } = userState[senderId];
    const formattedNumber = senderId.replace('@c.us', '');
    const whatsappLink = `https://wa.me/${formattedNumber}`;

    const detalhesFormatados = `
        *Nome:* ${name}
        *Serviço:* ${service}
        *Detalhes:*
        ${Object.entries(details).map(([question, answer]) => `- *${question}*: ${answer}`).join('\n')}
    `;

    await sendWithRetry(senderId, `*Pronto! Seu contato já foi encaminhado para o Leonardo,* se precisar de alguma informação basta digitar (MENU)`);
    await sendWithRetry('5521967229853@c.us', `*Cliente:* ${whatsappLink}\n*Solicitando atendimento*\n\n${detalhesFormatados}`);

    userState[senderId].stage = 'awaitingContactConfirmation';
}
