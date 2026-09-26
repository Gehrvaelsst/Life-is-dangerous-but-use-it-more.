/* =========================================
   LIFE IS DANGEROUS, BUT USE IT MORE.
   SCRIPT PRINCIPAL
========================================= */


/* =========================================
   TELAS
========================================= */

const telaInicial = document.getElementById("tela-inicial");
const telaPersonagens = document.getElementById("tela-personagens");
const telaJogo = document.getElementById("tela-jogo");


/* =========================================
   ELEMENTOS
========================================= */

const botaoComecar = document.getElementById("btn-comecar");

const personagens = document.querySelectorAll(".personagem");

const mensagemPersonagem =
    document.getElementById("mensagem-personagem");

const eloy = document.getElementById("eloy");

const mundo = document.getElementById("mundo");

const analogo = document.getElementById("analogo");
const analogoCentro = document.getElementById("analogo-centro");

const horaTexto = document.getElementById("hora");
const periodoTexto = document.getElementById("periodo");


/* =========================================
   TROCA DE TELAS
========================================= */

function mostrarTela(tela) {

    telaInicial.classList.remove("ativa");
    telaPersonagens.classList.remove("ativa");
    telaJogo.classList.remove("ativa");

    tela.classList.add("ativa");
}


/* =========================================
   BOTÃO COMEÇAR
========================================= */

botaoComecar.addEventListener("click", () => {

    mostrarTela(telaPersonagens);

});


/* =========================================
   SELEÇÃO DE PERSONAGEM
========================================= */

personagens.forEach((personagem) => {

    personagem.addEventListener("click", () => {

        const nome = personagem.dataset.personagem;

        /*
            Somente Eloy está funcionando
            nesta primeira versão.
        */

        if (nome !== "Eloy") {

            mensagemPersonagem.textContent =
                `${nome} ainda não está disponível.`;

            return;
        }


        /* Eloy selecionado */

        mensagemPersonagem.textContent = "";

        iniciarJogo();

    });

});


/* =========================================
   INICIAR JOGO
========================================= */

function iniciarJogo() {

    mostrarTela(telaJogo);

    iniciarRelogio();

    posicionarEloy();

}


/* =========================================
   POSIÇÃO INICIAL DO ELOY
========================================= */

let eloyX = 900;
let eloyY = 600;

function posicionarEloy() {

    eloy.style.left = `${eloyX}px`;
    eloy.style.top = `${eloyY}px`;

}


/* =========================================
   RELÓGIO DO MUNDO
========================================= */

/*
    Horário inicial:
    08:00

    O tempo do jogo passa mais rápido
    que o tempo real.

    1 segundo real =
    1 minuto no jogo.
*/

let minutosDoJogo = 8 * 60;

let relogioAtivo = false;


function iniciarRelogio() {

    if (relogioAtivo) {
        return;
    }

    relogioAtivo = true;

    setInterval(() => {

        minutosDoJogo++;

        if (minutosDoJogo >= 24 * 60) {
            minutosDoJogo = 0;
        }

        atualizarRelogio();

    }, 1000);

    atualizarRelogio();
}


function atualizarRelogio() {

    const horas = Math.floor(minutosDoJogo / 60);

    const minutos = minutosDoJogo % 60;

    const horasFormatadas =
        String(horas).padStart(2, "0");

    const minutosFormatados =
        String(minutos).padStart(2, "0");


    horaTexto.textContent =
        `${horasFormatadas}:${minutosFormatados}`;


    /*
        08:00 até 17:59 = DIA
        18:00 até 07:59 = NOITE
    */

    if (horas >= 8 && horas < 18) {

        periodoTexto.textContent = "☀️ DIA";

        document.body.classList.remove("noite");

    } else {

        periodoTexto.textContent = "🌙 NOITE";

        document.body.classList.add("noite");

    }

}


/* =========================================
   ANALÓGICO
========================================= */

let analogoAtivo = false;

let direcaoX = 0;
let direcaoY = 0;


/* limite máximo que o botão pode se afastar */

const limiteAnalogo = 35;


/* =========================================
   TOQUE NO ANALÓGICO
========================================= */

analogo.addEventListener(
    "pointerdown",
    (evento) => {

        analogoAtivo = true;

        analogo.setPointerCapture(evento.pointerId);

        moverAnalogo(evento);

    }
);


analogo.addEventListener(
    "pointermove",
    (evento) => {

        if (!analogoAtivo) {
            return;
        }

        moverAnalogo(evento);

    }
);


analogo.addEventListener(
    "pointerup",
    (evento) => {

        analogoAtivo = false;

        direcaoX = 0;
        direcaoY = 0;

        resetarAnalogo();

    }
);


analogo.addEventListener(
    "pointercancel",
    () => {

        analogoAtivo = false;

        direcaoX = 0;
        direcaoY = 0;

        resetarAnalogo();

    }
);


/* =========================================
   MOVIMENTO DO ANALÓGICO
========================================= */

function moverAnalogo(evento) {

    const retangulo =
        analogo.getBoundingClientRect();


    const centroX =
        retangulo.left + retangulo.width / 2;

    const centroY =
        retangulo.top + retangulo.height / 2;


    let x =
        evento.clientX - centroX;

    let y =
        evento.clientY - centroY;


    const distancia =
        Math.sqrt(x * x + y * y);


    if (distancia > limiteAnalogo) {

        x =
            (x / distancia) *
            limiteAnalogo;

        y =
            (y / distancia) *
            limiteAnalogo;

    }


    analogoCentro.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;


    /*
        Transformamos a posição do analógico
        em valores entre -1 e 1.
    */

    direcaoX = x / limiteAnalogo;

    direcaoY = y / limiteAnalogo;

}


/* =========================================
   RESETAR ANALÓGICO
========================================= */

function resetarAnalogo() {

    analogoCentro.style.transform =
        "translate(-50%, -50%)";

}


/* =========================================
   MOVIMENTO DO ELOY
========================================= */

function atualizarMovimento() {

    /*
        Enquanto o analógico estiver sendo
        movimentado, Eloy anda.
    */

    const velocidade = 3;


    eloyX += direcaoX * velocidade;

    eloyY += direcaoY * velocidade;


    /* Limites provisórios do mundo */

    if (eloyX < 0) {
        eloyX = 0;
    }

    if (eloyY < 0) {
        eloyY = 0;
    }

    if (eloyX > 1936) {
        eloyX = 1936;
    }

    if (eloyY > 1336) {
        eloyY = 1336;
    }


    eloy.style.left =
        `${eloyX}px`;

    eloy.style.top =
        `${eloyY}px`;


    requestAnimationFrame(atualizarMovimento);

}


/* =========================================
   INICIAR LOOP DO JOGO
========================================= */

atualizarMovimento();
