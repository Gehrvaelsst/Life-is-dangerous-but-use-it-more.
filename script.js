/* =========================================================
   LIFE IS DANGEROUS, BUT USE IT MORE.
   SCRIPT PRINCIPAL — VERSÃO CORRIGIDA
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CONFIG = {

    mapa: {
        largura: 3200,
        altura: 2200
    },

    jogador: {
        velocidade: 4,
        raio: 24
    },

    camera: {
        suavidade: 0.15
    },

    tempo: {
        horas: 8,
        minutos: 0
    }

};


/* =========================================================
   ELEMENTOS
========================================================= */

const telaInicial =
    document.getElementById("tela-inicial");

const telaPersonagens =
    document.getElementById("tela-personagens");

const telaJogo =
    document.getElementById("tela-jogo");

const botaoComecar =
    document.getElementById("btn-comecar");

const mensagemPersonagem =
    document.getElementById("mensagem-personagem");

const personagemBotoes =
    document.querySelectorAll(".personagem");

const mundo =
    document.getElementById("mundo");

const areaMundo =
    document.getElementById("area-mundo");

const personagemJogador =
    document.getElementById("personagem-jogador");

const eloy =
    document.getElementById("eloy");

const imagemEloy =
    eloy.querySelector("img");

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
   ESTADO
========================================================= */

const estado = {

    iniciado: false,

    jogador: {

        x: 820,
        y: 610,

        direcao: "frente",

        andando: false,

        frame: 0,

        animacao: 0

    },

    camera: {

        x: 0,
        y: 0

    },

    joystick: {

        ativo: false,

        x: 0,
        y: 0,

        pointerId: null

    },

    teclado: {

        cima: false,
        baixo: false,
        esquerda: false,
        direita: false

    },

    tempo: {

        horas: 8,
        minutos: 0,

        acumulado: 0

    },

    ultimaAtualizacao:
        performance.now()

};


/* =========================================================
   TROCA DE TELA
========================================================= */

function mostrarTela(tela) {

    document
        .querySelectorAll(".tela")
        .forEach(item => {

            item.classList.remove("ativa");

        });


    tela.classList.add("ativa");

}


/* =========================================================
   BOTÃO COMEÇAR
========================================================= */

botaoComecar.addEventListener(
    "click",
    () => {

        mostrarTela(
            telaPersonagens
        );

    }
);


/* =========================================================
   SELEÇÃO DE PERSONAGEM
========================================================= */

personagemBotoes.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            const personagem =
                botao.dataset.personagem;


            if (
                botao.classList.contains("bloqueado")
            ) {

                mensagemPersonagem.textContent =
                    `${personagem} ainda está bloqueado.`;

                mensagemPersonagem.classList.add(
                    "mostrar"
                );


                setTimeout(() => {

                    mensagemPersonagem.classList.remove(
                        "mostrar"
                    );

                }, 1500);

                return;

            }


            if (personagem === "Eloy") {

                iniciarJogo();

            }

        }
    );

});


/* =========================================================
   INICIAR JOGO
========================================================= */

function iniciarJogo() {

    estado.iniciado = true;


    mostrarTela(
        telaJogo
    );


    estado.jogador.x = 820;
    estado.jogador.y = 610;


    estado.camera.x = 0;
    estado.camera.y = 0;


    prepararEloy();


    atualizarPosicaoJogador();


    atualizarCamera(true);


    atualizarRelogio();


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   ELOY
========================================================= */

function prepararEloy() {

    /*
       Escondemos a imagem original porque ela é
       a folha de sprites.
    */

    imagemEloy.style.display = "none";


    /*
       Criamos uma imagem própria para mostrar
       somente um personagem.

       A folha original fica como background.
    */

    let sprite =
        document.getElementById(
            "sprite-renderizado"
        );


    if (!sprite) {

        sprite =
            document.createElement("div");

        sprite.id =
            "sprite-renderizado";

        eloy.appendChild(sprite);

    }


    sprite.style.position =
        "absolute";

    sprite.style.left =
        "0";

    sprite.style.top =
        "0";

    sprite.style.width =
        "100%";

    sprite.style.height =
        "100%";

    sprite.style.backgroundImage =
        `url("${imagemEloy.src}")`;

    sprite.style.backgroundRepeat =
        "no-repeat";

    sprite.style.backgroundPosition =
        "0% 0%";

    sprite.style.backgroundSize =
        "400% 400%";

    sprite.style.imageRendering =
        "pixelated";

    sprite.style.pointerEvents =
        "none";


    atualizarSprite();

}


/* =========================================================
   SPRITE
========================================================= */

function atualizarSprite() {

    const sprite =
        document.getElementById(
            "sprite-renderizado"
        );


    if (!sprite) {
        return;
    }


    let linha = 0;


    if (
        estado.jogador.direcao ===
        "frente"
    ) {

        linha = 0;

    }

    else if (
        estado.jogador.direcao ===
        "esquerda"
    ) {

        linha = 1;

    }

    else if (
        estado.jogador.direcao ===
        "direita"
    ) {

        linha = 2;

    }

    else if (
        estado.jogador.direcao ===
        "costas"
    ) {

        linha = 3;

    }


    const coluna =
        estado.jogador.frame;


    const x =
        coluna * 33.3333;

    const y =
        linha * 33.3333;


    sprite.style.backgroundPosition =
        `${x}% ${y}%`;

}


/* =========================================================
   POSIÇÃO
========================================================= */

function atualizarPosicaoJogador() {

    personagemJogador.style.left =
        `${estado.jogador.x}px`;

    personagemJogador.style.top =
        `${estado.jogador.y}px`;

}


/* =========================================================
   DIREÇÃO
========================================================= */

function atualizarDirecao(dx, dy) {

    if (
        Math.abs(dx) <
        Math.abs(dy)
    ) {

        if (dy > 0) {

            estado.jogador.direcao =
                "frente";

        } else {

            estado.jogador.direcao =
                "costas";

        }

    }

    else {

        if (dx > 0) {

            estado.jogador.direcao =
                "direita";

        } else {

            estado.jogador.direcao =
                "esquerda";

        }

    }


    atualizarSprite();

}


/* =========================================================
   COLISÃO
========================================================= */

function obterRetanguloMundo(elemento) {

    const retangulo =
        elemento.getBoundingClientRect();


    const mundoRetangulo =
        mundo.getBoundingClientRect();


    /*
       Converte a posição visual do elemento
       para coordenadas internas do mundo.

       Isso corrige o problema das regiões
       aninhadas.
    */

    const escalaX =
        mundo.offsetWidth /
        mundoRetangulo.width;

    const escalaY =
        mundo.offsetHeight /
        mundoRetangulo.height;


    return {

        left:
            (retangulo.left -
            mundoRetangulo.left)
            * escalaX,

        top:
            (retangulo.top -
            mundoRetangulo.top)
            * escalaY,

        width:
            retangulo.width *
            escalaX,

        height:
            retangulo.height *
            escalaY

    };

}


/* =========================================================
   OBJETOS BLOQUEADORES
========================================================= */

function obterColisoes() {

    const seletores = [

        ".muralha",

        ".casa",

        ".grande",

        ".ruina",

        ".templo",

        ".arvore",

        ".pedra",

        ".entulho",

        ".fonte"

    ];


    const lista = [];


    seletores.forEach(seletor => {

        document
            .querySelectorAll(seletor)
            .forEach(elemento => {

                lista.push(
                    obterRetanguloMundo(elemento)
                );

            });

    });


    return lista;

}


/* =========================================================
   VERIFICAR COLISÃO
========================================================= */

function existeColisao(x, y) {

    const raio =
        CONFIG.jogador.raio;


    const esquerda =
        x - raio;

    const direita =
        x + raio;

    const topo =
        y - raio;

    const baixo =
        y + raio;


    const colisoes =
        obterColisoes();


    for (
        const objeto of colisoes
    ) {

        if (

            direita > objeto.left &&
            esquerda <
                objeto.left +
                objeto.width &&

            baixo > objeto.top &&
            topo <
                objeto.top +
                objeto.height

        ) {

            return true;

        }

    }


    return false;

}


/* =========================================================
   LIMITES
========================================================= */

function dentroDoMapa(x, y) {

    const margem = 75;


    return (

        x > margem &&
        x <
            CONFIG.mapa.largura -
            margem &&

        y > margem &&
        y <
            CONFIG.mapa.altura -
            margem

    );

}


/* =========================================================
   MOVIMENTO
========================================================= */

function moverJogador(dx, dy) {

    const tamanho =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (tamanho > 1) {

        dx /= tamanho;
        dy /= tamanho;

    }


    if (
        Math.abs(dx) < 0.01 &&
        Math.abs(dy) < 0.01
    ) {

        estado.jogador.andando =
            false;

        return;

    }


    estado.jogador.andando =
        true;


    atualizarDirecao(
        dx,
        dy
    );


    /*
       Movimento horizontal
    */

    const novoX =
        estado.jogador.x +
        dx *
        CONFIG.jogador.velocidade;


    if (

        dentroDoMapa(
            novoX,
            estado.jogador.y
        )

        &&

        !existeColisao(
            novoX,
            estado.jogador.y
        )

    ) {

        estado.jogador.x =
            novoX;

    }


    /*
       Movimento vertical
    */

    const novoY =
        estado.jogador.y +
        dy *
        CONFIG.jogador.velocidade;


    if (

        dentroDoMapa(
            estado.jogador.x,
            novoY
        )

        &&

        !existeColisao(
            estado.jogador.x,
            novoY
        )

    ) {

        estado.jogador.y =
            novoY;

    }


    atualizarPosicaoJogador();

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    evento => {

        const tecla =
            evento.key.toLowerCase();


        if (
            tecla === "w" ||
            tecla === "arrowup"
        ) {

            estado.teclado.cima = true;

        }


        if (
            tecla === "s" ||
            tecla === "arrowdown"
        ) {

            estado.teclado.baixo = true;

        }


        if (
            tecla === "a" ||
            tecla === "arrowleft"
        ) {

            estado.teclado.esquerda = true;

        }


        if (
            tecla === "d" ||
            tecla === "arrowright"
        ) {

            estado.teclado.direita = true;

        }

    }
);


document.addEventListener(
    "keyup",
    evento => {

        const tecla =
            evento.key.toLowerCase();


        if (
            tecla === "w" ||
            tecla === "arrowup"
        ) {

            estado.teclado.cima = false;

        }


        if (
            tecla === "s" ||
            tecla === "arrowdown"
        ) {

            estado.teclado.baixo = false;

        }


        if (
            tecla === "a" ||
            tecla === "arrowleft"
        ) {

            estado.teclado.esquerda = false;

        }


        if (
            tecla === "d" ||
            tecla === "arrowright"
        ) {

            estado.teclado.direita = false;

        }

    }
);


/* =========================================================
   DIREÇÃO DO TECLADO
========================================================= */

function obterTeclado() {

    let x = 0;
    let y = 0;


    if (estado.teclado.direita) {
        x++;
    }

    if (estado.teclado.esquerda) {
        x--;
    }

    if (estado.teclado.baixo) {
        y++;
    }

    if (estado.teclado.cima) {
        y--;
    }


    return {
        x,
        y
    };

}


/* =========================================================
   ANALÓGICO
========================================================= */

function atualizarJoystick(
    clienteX,
    clienteY
) {

    const retangulo =
        analogo.getBoundingClientRect();


    const centroX =
        retangulo.left +
        retangulo.width / 2;

    const centroY =
        retangulo.top +
        retangulo.height / 2;


    let x =
        clienteX -
        centroX;

    let y =
        clienteY -
        centroY;


    const raio =
        retangulo.width / 2;


    const distancia =
        Math.sqrt(
            x * x +
            y * y
        );


    if (
        distancia > raio
    ) {

        x =
            x /
            distancia *
            raio;

        y =
            y /
            distancia *
            raio;

    }


    const limite =
        raio - 32;


    estado.joystick.x =
        x / limite;

    estado.joystick.y =
        y / limite;


    estado.joystick.x =
        Math.max(
            -1,
            Math.min(
                1,
                estado.joystick.x
            )
        );


    estado.joystick.y =
        Math.max(
            -1,
            Math.min(
                1,
                estado.joystick.y
            )
        );


    analogoCentro.style.transform =
        `translate(
            calc(-50% + ${
                estado.joystick.x *
                limite
            }px),
            calc(-50% + ${
                estado.joystick.y *
                limite
            }px)
        )`;

}


/* =========================================================
   COMEÇAR ANALÓGICO
========================================================= */

analogo.addEventListener(
    "pointerdown",
    evento => {

        evento.preventDefault();


        estado.joystick.ativo =
            true;

        estado.joystick.pointerId =
            evento.pointerId;


        analogo.setPointerCapture(
            evento.pointerId
        );


        atualizarJoystick(
            evento.clientX,
            evento.clientY
        );

    }
);


/* =========================================================
   MOVER ANALÓGICO
========================================================= */

analogo.addEventListener(
    "pointermove",
    evento => {

        if (
            !estado.joystick.ativo
        ) {

            return;

        }


        if (
            evento.pointerId !==
            estado.joystick.pointerId
        ) {

            return;

        }


        evento.preventDefault();


        atualizarJoystick(
            evento.clientX,
            evento.clientY
        );

    }
);


/* =========================================================
   SOLTAR ANALÓGICO
========================================================= */

function soltarAnalogo() {

    estado.joystick.ativo =
        false;

    estado.joystick.x = 0;
    estado.joystick.y = 0;

    estado.joystick.pointerId =
        null;


    analogoCentro.style.transform =
        "translate(-50%, -50%)";

}


analogo.addEventListener(
    "pointerup",
    soltarAnalogo
);

analogo.addEventListener(
    "pointercancel",
    soltarAnalogo
);

analogo.addEventListener(
    "lostpointercapture",
    soltarAnalogo
);


/* =========================================================
   CÂMERA
========================================================= */

function atualizarCamera(
    instantanea = false
) {

    const largura =
        areaMundo.clientWidth;

    const altura =
        areaMundo.clientHeight;


    let alvoX =
        estado.jogador.x -
        largura / 2;


    let alvoY =
        estado.jogador.y -
        altura / 2;


    const limiteX =
        CONFIG.mapa.largura -
        largura;


    const limiteY =
        CONFIG.mapa.altura -
        altura;


    alvoX =
        Math.max(
            0,
            Math.min(
                limiteX,
                alvoX
            )
        );


    alvoY =
        Math.max(
            0,
            Math.min(
                limiteY,
                alvoY
            )
        );


    if (instantanea) {

        estado.camera.x =
            alvoX;

        estado.camera.y =
            alvoY;

    }

    else {

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
        `translate(
            ${-estado.camera.x}px,
            ${-estado.camera.y}px
        )`;

}


/* =========================================================
   REGIÃO
========================================================= */

function atualizarRegiao() {

    const x =
        estado.jogador.x;

    const y =
        estado.jogador.y;


    let nome =
        "ARREDORES";


    if (
        x >= 300 &&
        x <= 1500 &&
        y >= 220 &&
        y <= 950
    ) {

        nome =
            "DISTRITO CENTRAL";

    }

    else if (
        x >= 230 &&
        x <= 1280 &&
        y >= 1250 &&
        y <= 1950
    ) {

        nome =
            "DISTRITO ABANDONADO";

    }

    else if (
        x >= 1300 &&
        x <= 1950 &&
        y >= 1320 &&
        y <= 1940
    ) {

        nome =
            "ZONA DE RUPTURA";

    }

    else if (
        x >= 2050 &&
        x <= 2800 &&
        y >= 250 &&
        y <= 870
    ) {

        nome =
            "ZONA RITUALÍSTICA";

    }

    else if (
        x >= 2050 &&
        x <= 3000 &&
        y >= 1050 &&
        y <= 1900
    ) {

        nome =
            "FLORESTA EXTERIOR";

    }


    nomeLocal.textContent =
        nome;

}


/* =========================================================
   RELÓGIO
======================================================== */

function atualizarRelogio() {

    horaElemento.textContent =
        String(
            estado.tempo.horas
        ).padStart(2, "0")
        +
        ":"
        +
        String(
            estado.tempo.minutos
        ).padStart(2, "0");


    if (
        estado.tempo.horas >= 18 ||
        estado.tempo.horas < 8
    ) {

        periodoElemento.textContent =
            "☾ NOITE";

        document.body.classList.add(
            "noite"
        );

    }

    else {

        periodoElemento.textContent =
            "☀ DIA";

        document.body.classList.remove(
            "noite"
        );

    }

}


/* =========================================================
   PASSAGEM DO TEMPO
========================================================= */

function atualizarTempo(delta) {

    estado.tempo.acumulado +=
        delta;


    /*
       1 minuto do jogo =
       1 segundo real.
    */

    if (
        estado.tempo.acumulado >=
        1000
    ) {

        const minutos =
            Math.floor(
                estado.tempo.acumulado /
                1000
            );


        estado.tempo.acumulado -=
            minutos * 1000;


        estado.tempo.minutos +=
            minutos;


        while (
            estado.tempo.minutos >= 60
        ) {

            estado.tempo.minutos -=
                60;

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
   ANIMAÇÃO
========================================================= */

function atualizarAnimacao(delta) {

    if (
        !estado.jogador.andando
    ) {

        estado.jogador.frame = 0;

        atualizarSprite();

        return;

    }


    estado.jogador.animacao +=
        delta;


    if (
        estado.jogador.animacao >=
        130
    ) {

        estado.jogador.animacao = 0;


        estado.jogador.frame++;


        if (
            estado.jogador.frame >= 4
        ) {

            estado.jogador.frame = 0;

        }


        atualizarSprite();

    }

}


/* =========================================================
   LOOP
========================================================= */

function loop(tempoAtual) {

    if (!estado.iniciado) {

        requestAnimationFrame(
            loop
        );

        return;

    }


    const delta =
        tempoAtual -
        estado.ultimaAtualizacao;


    estado.ultimaAtualizacao =
        tempoAtual;


    /*
       Primeiro teclado.
    */

    let direcao =
        obterTeclado();


    /*
       Se não estiver usando teclado,
       usa o analógico.
    */

    if (
        direcao.x === 0 &&
        direcao.y === 0
    ) {

        direcao.x =
            estado.joystick.x;

        direcao.y =
            estado.joystick.y;

    }


    moverJogador(
        direcao.x,
        direcao.y
    );


    atualizarAnimacao(
        delta
    );


    atualizarCamera();


    atualizarTempo(
        delta
    );


    atualizarRegiao();


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   EVITAR SCROLL NO CELULAR
========================================================= */

document.addEventListener(
    "touchmove",
    evento => {

        if (
            estado.iniciado
        ) {

            evento.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   FIM
========================================================= */

console.log(
    "Life is dangerous, but use it more. carregado."
);
