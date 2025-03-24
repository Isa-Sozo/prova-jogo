const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
let jogoAtivo = true; 


const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false,
    Enter: false 
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && !jogoAtivo) {
        reiniciarJogo(); 
    }
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(tecla)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
    }
    
    atualizar() {
        if (!jogoAtivo) return; 
        if (teclasPressionadas.KeyW) {
            this.y -= 5;
        } else if (teclasPressionadas.KeyS) {
            this.y += 5;
        } else if (teclasPressionadas.KeyA) {
            this.x -= 5;
        } else if (teclasPressionadas.KeyD) {
            this.x += 5;
        }

        if (this.x < 0 || this.x + this.largura > canvas.width || 
            this.y < 0 || this.y + this.altura > canvas.height) {
            jogoAtivo = false; 
        }
    }

    desenhar() {
        ctx.fillStyle = 'purple'; 
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    verificarColisao(comida) {
        if (
            this.x < comida.x + comida.largura &&
            this.x + this.largura > comida.x &&
            this.y < comida.y + comida.altura &&
            this.y + this.altura > comida.y
        ) {
            this.#houveColisao(comida);
        }
    }

    #houveColisao(comida) {
        comida.x = Math.random() * (canvas.width - comida.largura);
        comida.y = Math.random() * (canvas.height - comida.altura);
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random() * canvas.width - 10, Math.random() * canvas.height - 10, 20, 20);
    }

    desenhar() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();

function exibirGameOver() {
    ctx.fillStyle = 'hsla(342, 96.90%, 62.50%, 0.70)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'BEIGE';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'transparent'; 
    ctx.fillText('Pressione ENTER para reiniciar', canvas.width / 2, canvas.height / 2 + 40);
}

function reiniciarJogo() {
    jogoAtivo = true; 
    cobra.x = 100; 
    cobra.y = 200;
    loop(); 
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (jogoAtivo) {
        cobra.desenhar();
        cobra.atualizar();
        comida.desenhar();
        cobra.verificarColisao(comida);
        requestAnimationFrame(loop);
    } else {
        exibirGameOver();
    }
}

loop();