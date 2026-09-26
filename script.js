/* =========================================================
   LIFE IS DANGEROUS, BUT USE IT MORE.
   SCRIPT PRINCIPAL
========================================================= */


/* =========================================================
   CONFIGURAÇÕES DO JOGO
========================================================= */

const CONFIG = {

    mapa: {
        largura: 3200,
        altura: 2200
    },

    jogador: {
        velocidade: 3.2,
        largura: 42,
        altura: 42
    },

    camera: {
        suavidade: 0.12
    },

    tempo: {
        horaInicial: 8,
        minutoInicial: 0,

        // 1 minuto do jogo = 1 segundo real
        minutosPorSegundo: 1
    },

    sprite: {
        colunas: 4,
        linhas: 4,
        frames: 4,

        // Linhas do sprite:
        // 0 = frente
        // 1 = esquerda
        // 2 = direita
        // 3 = costas
        frente: 0,
        esquerda: 1,
        direita: 2,
        costas: 3
    }

};


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const telaInicial =
    document.getElementById("tela-inicial");

const telaPersonagens =
    document.getElementById("tela-personagens");

const telaJogo =
    document.getElementById("tela-jogo");

const botaoComecar =
    document.getElementById("btn-comecar");

const listaPersonagens =
    document.getElementById("lista-personagens");

const mensagemPersonagem =
    document.getElementById("mensagem-personagem");

const mundo =
    document.getElementById("mundo");

const personagemJogador =
    document.getElementById("personagem-jogador");

const eloy =
    document.getElementById("eloy");

const imagemEloy =
    eloy.querySelector("img");

const areaMundo =
    document.getElementById("area-mundo");

const analogo =
    document.getElementById("analogo");

const analogoCentro =
    document.getElementById("analogo-centro");

const horaElemento =
    document.getElementById("hora");

const periodoElemento =
    document.getElementById("periodo");

const nomeLocal =
    document.getElementById("nome-local");


/* =========================================================
   ESTADO DO JOGO
========================================================= */

const estado = {

    jogoIniciado: false,

    personagemSelecionado: null,

    jogador: {
        x: 1500,
        y: 900,

        velocidadeX: 0,
        velocidadeY: 0,

        direcao: "frente",

        andando: false,

        frame: 0,

        contadorAnimacao: 0
    },

    camera: {
        x: 0,
        y: 0
    },

    joystick: {
        ativo: false,

        x: 0,
        y: 0
    },

    teclado: {
        cima: false,
        baixo: false,
        esquerda: false,
        direita: false
    },

    tempo: {
        horas: CONFIG.tempo.horaInicial,
        minutos: CONFIG.tempo.minutoInicial,

        acumulado: 0
    },

    ultimoFrame: performance.now(),

    colisoes: [],

    regioes: []

};


/* =========================================================
   UTILITÁRIOS
========================================================= */

function limitar(valor, minimo, maximo) {

    return Math.max(
        minimo,
        Math.min(valor, maximo)
    );

}


function distancia(x1, y1, x2, y2) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(
        dx * dx + dy * dy
    );

}


function mostrarTela(tela) {

    document
        .querySelectorAll(".tela")
        .forEach(elemento => {
            elemento.classList.remove("ativa");
        });

    tela.classList.add("ativa");

}


function formatarHora(hora, minuto) {

    const h =
        String(hora).padStart(2, "0");

    const m =
        String(minuto).padStart(2, "0");

    return `${h}:${m}`;

}
/* =========================================================
   TELA INICIAL
========================================================= */

botaoComecar.addEventListener("click", () => {

    mostrarTela(telaPersonagens);

});


/* =========================================================
   SELEÇÃO DE PERSONAGEM
========================================================= */

const personagens =
    document.querySelectorAll(".personagem");


personagens.forEach(botao => {

    botao.addEventListener("click", () => {

        const nome =
            botao.dataset.personagem;

        if (
            botao.classList.contains("bloqueado")
        ) {

            mensagemPersonagem.textContent =
                `${nome} ainda não está disponível.`;

            mensagemPersonagem.classList.add("mostrar");

            setTimeout(() => {

                mensagemPersonagem.classList.remove("mostrar");

            }, 1800);

            return;
        }


        if (nome === "Eloy") {

            estado.personagemSelecionado =
                "Eloy";

            iniciarJogo();

        }

    });

});


/* =========================================================
   INICIAR JOGO
========================================================= */

function iniciarJogo() {

    estado.jogoIniciado = true;

    mostrarTela(telaJogo);

    prepararSpriteEloy();

    prepararColisoes();

    prepararRegioes();

    posicionarJogador();

    atualizarRelogio();

    atualizarCamera(true);

    iniciarLoop();

}


/* =========================================================
   SPRITE DO ELOY
========================================================= */

function prepararSpriteEloy() {

    if (!imagemEloy) {
        return;
    }


    imagemEloy.style.display = "none";


    imagemEloy.addEventListener(
        "load",
        criarCanvasSprite,
        { once: true }
    );


    if (imagemEloy.complete) {

        criarCanvasSprite();

    }

}


/* =========================================================
   CANVAS DO SPRITE
========================================================= */

let canvasEloy = null;
let contextoEloy = null;

let larguraFrame = 0;
let alturaFrame = 0;


function criarCanvasSprite() {

    if (!imagemEloy.naturalWidth) {
        return;
    }


    if (canvasEloy) {
        return;
    }


    larguraFrame =
        imagemEloy.naturalWidth /
        CONFIG.sprite.colunas;


    alturaFrame =
        imagemEloy.naturalHeight /
        CONFIG.sprite.linhas;


    canvasEloy =
        document.createElement("canvas");


    canvasEloy.width =
        larguraFrame;

    canvasEloy.height =
        alturaFrame;


    contextoEloy =
        canvasEloy.getContext("2d");


    canvasEloy.style.width = "100%";
    canvasEloy.style.height = "100%";

    canvasEloy.style.imageRendering =
        "pixelated";

    canvasEloy.draggable = false;


    eloy.appendChild(canvasEloy);


    desenharSprite();

}


/* =========================================================
   DESENHAR FRAME
========================================================= */

function desenharSprite() {

    if (
        !canvasEloy ||
        !contextoEloy ||
        !imagemEloy.naturalWidth
    ) {
        return;
    }


    let linha =
        CONFIG.sprite.frente;


    if (estado.jogador.direcao === "esquerda") {

        linha =
            CONFIG.sprite.esquerda;

    }

    else if (
        estado.jogador.direcao === "direita"
    ) {

        linha =
            CONFIG.sprite.direita;

    }

    else if (
        estado.jogador.direcao === "costas"
    ) {

        linha =
            CONFIG.sprite.costas;

    }


    contextoEloy.clearRect(
        0,
        0,
        canvasEloy.width,
        canvasEloy.height
    );


    contextoEloy.drawImage(

        imagemEloy,

        estado.jogador.frame *
            larguraFrame,

        linha *
            alturaFrame,

        larguraFrame,
        alturaFrame,

        0,
        0,

        canvasEloy.width,
        canvasEloy.height

    );

}


/* =========================================================
   POSIÇÃO INICIAL
========================================================= */

function posicionarJogador() {

    // Praça central

    estado.jogador.x = 820;
    estado.jogador.y = 610;


    personagemJogador.style.left =
        `${estado.jogador.x}px`;

    personagemJogador.style.top =
        `${estado.jogador.y}px`;

}


/* =========================================================
   DIREÇÃO DO PERSONAGEM
========================================================= */

function atualizarDirecao(dx, dy) {

    if (
        Math.abs(dx) < 0.01 &&
        Math.abs(dy) < 0.01
    ) {
        return;
    }


    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0) {

            estado.jogador.direcao =
                "direita";

        } else {

            estado.jogador.direcao =
                "esquerda";

        }

    } else {

        if (dy > 0) {

            estado.jogador.direcao =
                "frente";

        } else {

            estado.jogador.direcao =
                "costas";

        }

    }

}
/* =========================================================
   COLISÕES
========================================================= */

function prepararColisoes() {

    estado.colisoes = [];


    const seletores = [

        ".muralha-norte",
        ".muralha-sul",
        ".muralha-oeste",
        ".muralha-leste",

        ".casa",
        ".grande",

        ".ruina",
        ".templo",

        ".arvore",

        ".pedra",

        ".entulho",

        ".fonte"

    ];


    seletores.forEach(seletor => {

        document
            .querySelectorAll(seletor)
            .forEach(elemento => {

                estado.colisoes.push(elemento);

            });

    });

}


/* =========================================================
   TESTE DE COLISÃO
========================================================= */

function jogadorColide(x, y) {

    const raioX =
        CONFIG.jogador.largura / 2;

    const raioY =
        CONFIG.jogador.altura / 2;


    for (
        const elemento of estado.colisoes
    ) {

        const left =
            elemento.offsetLeft;

        const top =
            elemento.offsetTop;

        const width =
            elemento.offsetWidth;

        const height =
            elemento.offsetHeight;


        const jogadorEsquerda =
            x - raioX;

        const jogadorDireita =
            x + raioX;

        const jogadorTopo =
            y - raioY;

        const jogadorBaixo =
            y + raioY;


        if (

            jogadorDireita > left &&
            jogadorEsquerda < left + width &&
            jogadorBaixo > top &&
            jogadorTopo < top + height

        ) {

            return true;

        }

    }


    return false;

}


/* =========================================================
   LIMITES DO MAPA
========================================================= */

function dentroDoMapa(x, y) {

    const margem = 70;


    return (

        x >= margem &&
        x <= CONFIG.mapa.largura - margem &&
        y >= margem &&
        y <= CONFIG.mapa.altura - margem

    );

}


/* =========================================================
   MOVIMENTO
========================================================= */

function moverJogador(dx, dy) {

    const comprimento =
        Math.sqrt(dx * dx + dy * dy);


    if (comprimento > 1) {

        dx /= comprimento;
        dy /= comprimento;

    }


    const velocidade =
        CONFIG.jogador.velocidade;


    const movimentoX =
        dx * velocidade;

    const movimentoY =
        dy * velocidade;


    const novoX =
        estado.jogador.x + movimentoX;

    const novoY =
        estado.jogador.y + movimentoY;


    /*
       Colisão horizontal.
    */

    if (
        dentroDoMapa(novoX, estado.jogador.y) &&
        !jogadorColide(
            novoX,
            estado.jogador.y
        )
    ) {

        estado.jogador.x = novoX;

    }


    /*
       Colisão vertical.
    */

    if (
        dentroDoMapa(estado.jogador.x, novoY) &&
        !jogadorColide(
            estado.jogador.x,
            novoY
        )
    ) {

        estado.jogador.y = novoY;

    }


    estado.jogador.andando =
        Math.abs(dx) > 0.01 ||
        Math.abs(dy) > 0.01;


    atualizarDirecao(dx, dy);

}


/* =========================================================
   ANIMAÇÃO
========================================================= */

function atualizarAnimacao(delta) {

    if (!estado.jogador.andando) {

        estado.jogador.frame = 0;

        desenharSprite();

        return;

    }


    estado.jogador.contadorAnimacao += delta;


    if (
        estado.jogador.contadorAnimacao >= 120
    ) {

        estado.jogador.contadorAnimacao = 0;


        estado.jogador.frame++;

        if (
            estado.jogador.frame >=
            CONFIG.sprite.frames
        ) {

            estado.jogador.frame = 0;

        }


        desenharSprite();

    }

}


/* =========================================================
   CÂMERA
========================================================= */

function atualizarCamera(forcar = false) {

    const larguraTela =
        areaMundo.clientWidth;

    const alturaTela =
        areaMundo.clientHeight;


    let alvoX =
        estado.jogador.x -
        larguraTela / 2;


    let alvoY =
        estado.jogador.y -
        alturaTela / 2;


    const limiteX =
        CONFIG.mapa.largura -
        larguraTela;


    const limiteY =
        CONFIG.mapa.altura -
        alturaTela;


    alvoX =
        limitar(
            alvoX,
            0,
            Math.max(0, limiteX)
        );


    alvoY =
        limitar(
            alvoY,
            0,
            Math.max(0, limiteY)
        );


    if (forcar) {

        estado.camera.x = alvoX;
        estado.camera.y = alvoY;

    } else {

        estado.camera.x +=
            (
                alvoX -
                estado.camera.x
            ) *
            CONFIG.camera.suavidade;


        estado.camera.y +=
            (
                alvoY -
                estado.camera.y
            ) *
            CONFIG.camera.suavidade;

    }


    mundo.style.transform =
        `translate(${-estado.camera.x}px, ${-estado.camera.y}px)`;

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    evento => {

        switch (evento.key.toLowerCase()) {

            case "w":
            case "arrowup":
                estado.teclado.cima = true;
                break;

            case "s":
            case "arrowdown":
                estado.teclado.baixo = true;
                break;

            case "a":
            case "arrowleft":
                estado.teclado.esquerda = true;
                break;

            case "d":
            case "arrowright":
                estado.teclado.direita = true;
                break;

        }

    }
);


document.addEventListener(
    "keyup",
    evento => {

        switch (evento.key.toLowerCase()) {

            case "w":
            case "arrowup":
                estado.teclado.cima = false;
                break;

            case "s":
            case "arrowdown":
                estado.teclado.baixo = false;
                break;

            case "a":
            case "arrowleft":
                estado.teclado.esquerda = false;
                break;

            case "d":
            case "arrowright":
                estado.teclado.direita = false;
                break;

        }

    }
);


/* =========================================================
   PEGAR DIREÇÃO DO TECLADO
========================================================= */

function obterDirecaoTeclado() {

    let x = 0;
    let y = 0;


    if (estado.teclado.direita) {
        x += 1;
    }

    if (estado.teclado.esquerda) {
        x -= 1;
    }

    if (estado.teclado.baixo) {
        y += 1;
    }

    if (estado.teclado.cima) {
        y -= 1;
    }


    return {
        x,
        y
    };

        }
/* =========================================================
   ANALÓGICO
========================================================= */

let ponteiroAnalogico = null;


function calcularJoystick(
    clienteX,
    clienteY
) {

    const rect =
        analogo.getBoundingClientRect();


    const centroX =
        rect.left + rect.width / 2;

    const centroY =
        rect.top + rect.height / 2;


    let x =
        clienteX - centroX;

    let y =
        clienteY - centroY;


    const raio =
        rect.width / 2;


    const distanciaAtual =
        Math.sqrt(
            x * x +
            y * y
        );


    if (distanciaAtual > raio) {

        x =
            x / distanciaAtual *
            raio;

        y =
            y / distanciaAtual *
            raio;

    }


    const limiteInterno =
        raio - 32;


    const distanciaNormalizada =
        Math.min(
            1,
            distanciaAtual /
            limiteInterno
        );


    if (distanciaAtual > 0) {

        x =
            x / distanciaAtual *
            distanciaNormalizada;

        y =
            y / distanciaAtual *
            distanciaNormalizada;

    } else {

        x = 0;
        y = 0;

    }


    estado.joystick.x = x;
    estado.joystick.y = y;


    analogoCentro.style.transform =
        `translate(
            calc(-50% + ${x * limiteInterno}px),
            calc(-50% + ${y * limiteInterno}px)
        )`;

}


function iniciarJoystick(evento) {

    evento.preventDefault();

    estado.joystick.ativo = true;

    ponteiroAnalogico =
        evento.pointerId;

    analogo.setPointerCapture(
        evento.pointerId
    );


    calcularJoystick(
        evento.clientX,
        evento.clientY
    );

}


function moverJoystick(evento) {

    if (
        !estado.joystick.ativo ||
        evento.pointerId !== ponteiroAnalogico
    ) {
        return;
    }


    evento.preventDefault();


    calcularJoystick(
        evento.clientX,
        evento.clientY
    );

}


function pararJoystick(evento) {

    if (
        evento.pointerId !== ponteiroAnalogico
    ) {
        return;
    }


    estado.joystick.ativo = false;

    ponteiroAnalogico = null;


    estado.joystick.x = 0;
    estado.joystick.y = 0;


    analogoCentro.style.transform =
        "translate(-50%, -50%)";


    try {

        analogo.releasePointerCapture(
            evento.pointerId
        );

    } catch (erro) {

        // Nada precisa ser feito.

    }

}


analogo.addEventListener(
    "pointerdown",
    iniciarJoystick
);

analogo.addEventListener(
    "pointermove",
    moverJoystick
);

analogo.addEventListener(
    "pointerup",
    pararJoystick
);

analogo.addEventListener(
    "pointercancel",
    pararJoystick
);


/* =========================================================
   REGIÕES DO MAPA
========================================================= */

function prepararRegioes() {

    estado.regioes = [

        {
            nome: "DISTRITO CENTRAL",

            x: 300,
            y: 220,
            largura: 1200,
            altura: 730
        },

        {
            nome: "DISTRITO ABANDONADO",

            x: 230,
            y: 1250,
            largura: 1050,
            altura: 700
        },

        {
            nome: "ZONA DE RUPTURA",

            x: 1300,
            y: 1320,
            largura: 650,
            altura: 620
        },

        {
            nome: "ZONA RITUALÍSTICA",

            x: 2050,
            y: 250,
            largura: 750,
            altura: 620
        },

        {
            nome: "FLORESTA EXTERIOR",

            x: 2050,
            y: 1050,
            largura: 950,
            altura: 850
        }

    ];

}


/* =========================================================
   ATUALIZAR NOME DA REGIÃO
========================================================= */

function atualizarRegiao() {

    const x =
        estado.jogador.x;

    const y =
        estado.jogador.y;


    let regiaoAtual =
        "ARREDORES";


    for (
        const regiao of estado.regioes
    ) {

        if (

            x >= regiao.x &&
            x <= regiao.x + regiao.largura &&

            y >= regiao.y &&
            y <= regiao.y + regiao.altura

        ) {

            regiaoAtual =
                regiao.nome;

            break;

        }

    }


    nomeLocal.textContent =
        regiaoAtual;

}


/* =========================================================
   RELÓGIO
========================================================= */

function atualizarTempo(delta) {

    estado.tempo.acumulado +=
        delta / 1000;


    if (
        estado.tempo.acumulado >=
        1 / CONFIG.tempo.minutosPorSegundo
    ) {

        const minutosPassados =
            Math.floor(
                estado.tempo.acumulado *
                CONFIG.tempo.minutosPorSegundo
            );


        estado.tempo.acumulado -=
            minutosPassados /
            CONFIG.tempo.minutosPorSegundo;


        estado.tempo.minutos +=
            minutosPassados;


        while (
            estado.tempo.minutos >= 60
        ) {

            estado.tempo.minutos -= 60;

            estado.tempo.horas++;

        }


        if (
            estado.tempo.horas >= 24
        ) {

            estado.tempo.horas = 0;

        }


        atualizarRelogio();

    }

}


/* =========================================================
   DIA / NOITE
========================================================= */

function verificarPeriodo() {

    const hora =
        estado.tempo.horas;


    const noite =
        hora >= 18 ||
        hora < 8;


    if (noite) {

        document.body.classList.add("noite");

        periodoElemento.textContent =
            "☾ NOITE";

    } else {

        document.body.classList.remove("noite");

        periodoElemento.textContent =
            "☀ DIA";

    }

}


function atualizarRelogio() {

    horaElemento.textContent =
        formatarHora(
            estado.tempo.horas,
            estado.tempo.minutos
        );


    verificarPeriodo();

}


/* =========================================================
   ATUALIZAÇÃO DO MOVIMENTO
========================================================= */

function atualizarMovimento() {

    let dx =
        estado.joystick.x;

    let dy =
        estado.joystick.y;


    const teclado =
        obterDirecaoTeclado();


    /*
       Se estiver usando teclado,
       ele assume o controle.
    */

    if (
        teclado.x !== 0 ||
        teclado.y !== 0
    ) {

        dx = teclado.x;
        dy = teclado.y;

    }


    moverJogador(
        dx,
        dy
    );


    personagemJogador.style.left =
        `${estado.jogador.x}px`;

    personagemJogador.style.top =
        `${estado.jogador.y}px`;

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

let loopAtivo = false;


function iniciarLoop() {

    if (loopAtivo) {
        return;
    }


    loopAtivo = true;

    estado.ultimoFrame =
        performance.now();


    requestAnimationFrame(
        loopJogo
    );

}


function loopJogo(tempoAtual) {

    const delta =
        tempoAtual -
        estado.ultimoFrame;


    estado.ultimoFrame =
        tempoAtual;


    if (estado.jogoIniciado) {

        atualizarMovimento();

        atualizarAnimacao(delta);

        atualizarCamera();

        atualizarTempo(delta);

        atualizarRegiao();

    }


    requestAnimationFrame(
        loopJogo
    );

}


/* =========================================================
   PREVENIR COMPORTAMENTOS DO CELULAR
========================================================= */

document.addEventListener(
    "touchmove",
    evento => {

        if (
            estado.jogoIniciado
        ) {

            evento.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.body.classList.remove("noite");

mensagemPersonagem.textContent = "";

console.log(
    "Life is dangerous, but use it more. — carregado."
);
