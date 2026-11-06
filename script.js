const sintese = window.speechSynthesis;
let utterance;
let vozesDisponiveis = [];

const textoEntrada = document.getElementById('textoEntrada');
const btnOuvir = document.getElementById('btnOuvir');
const btnPausar = document.getElementById('btnPausar');
const btnLimpar = document.getElementById('btnLimpar');
const seletorVoz = document.getElementById('seletorVoz');
const velocidade = document.getElementById('velocidade');
const tom = document.getElementById('tom');
const valorVelocidade = document.getElementById('valorVelocidade');
const valorTom = document.getElementById('valorTom');
const statusMsg = document.getElementById('statusMsg');

// Carregar vozes disponíveis
function carregarVozes() {
    vozesDisponiveis = sintese.getVoices();
    seletorVoz.innerHTML = '';
    
    // Priorizar vozes em português
    const vozesPT = vozesDisponiveis.filter(v => v.lang.includes('pt'));
    const outrasVozes = vozesDisponiveis.filter(v => !v.lang.includes('pt'));
    
    [...vozesPT, ...outrasVozes].forEach(voz => {
        const opcao = document.createElement('option');
        opcao.textContent = `${voz.name} (${voz.lang})`;
        opcao.setAttribute('data-voz', voz.name);
        seletorVoz.appendChild(opcao);
    });
}

carregarVozes();
if (sintese.onvoiceschanged !== undefined) {
    sintese.onvoiceschanged = carregarVozes;
}

// Atualizar mostradores de velocidade e tom
velocidade.addEventListener('input', () => {
    const v = parseFloat(velocidade.value);
    valorVelocidade.textContent = v === 1 ? 'Normal' : v.toFixed(1) + 'x';
});

tom.addEventListener('input', () => {
    const t = parseFloat(tom.value);
    valorTom.textContent = t === 1 ? 'Normal' : t.toFixed(1);
});

// Converter texto em fala
btnOuvir.addEventListener('click', () => {
    const texto = textoEntrada.value.trim();
    if (!texto) {
        alert('Por favor, escreva algum texto primeiro!');
        return;
    }

    sintese.cancel(); // Parar qualquer áudio anterior

    utterance = new SpeechSynthesisUtterance(texto);
    
    // Aplicar voz escolhida
    const vozEscolhida = vozesDisponiveis.find(v => 
        v.name === seletorVoz.selectedOptions[0].getAttribute('data-voz')
    );
    if (vozEscolhida) utterance.voice = vozEscolhida;
    
    utterance.rate = parseFloat(velocidade.value);
    utterance.pitch = parseFloat(tom.value);
    utterance.volume = 1;
    utterance.lang = 'pt-BR';

    utterance.onstart = () => {
        statusMsg.style.display = 'block';
        statusMsg.textContent = '🔊 Falando...';
    };

    utterance.onend = () => {
        statusMsg.textContent = '✅ Concluído!';
        setTimeout(() => statusMsg.style.display = 'none', 2000);
    };

    sintese.speak(utterance);
});

// Pausar e retomar
btnPausar.addEventListener('click', () => {
    if (sintese.speaking) {
        if (sintese.paused) {
            sintese.resume();
            btnPausar.textContent = '⏸ Pausar';
        } else {
            sintese.pause();
            btnPausar.textContent = '▶ Retomar';
        }
    }
});

// Limpar tudo
btnLimpar.addEventListener('click', () => {
    sintese.cancel();
    textoEntrada.value = '';
    statusMsg.style.display = 'none';
    btnPausar.textContent = '⏸ Pausar';
    textoEntrada.focus();
});
