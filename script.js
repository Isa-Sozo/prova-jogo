const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
let pontuacao = 0;
let pontuacaoMaxima = localStorage.getItem('pontuacaoMaxima') ? parseInt(localStorage.getItem('pontuacaoMaxima')) : 0; // Carrega a pontuação máxima do localStorage
let gameOver = false;
const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
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
        if (teclasPressionadas.KeyW) {
            this.y -= 5;
        } else if (teclasPressionadas.KeyS) {
            this.y += 5;
        } else if (teclasPressionadas.KeyA) {
            this.x -= 5;
        } else if (teclasPressionadas.KeyD) {
            this.x += 5;
        }

        if (this.x < 0 || this.x + this.largura > canvas.width || this.y < 0 || this.y + this.altura > canvas.height) {
            return true; 
        }

        return false; 
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
        pontuacao++; 
        if (pontuacao > pontuacaoMaxima) {
            pontuacaoMaxima = pontuacao;
            localStorage.setItem('pontuacaoMaxima', pontuacaoMaxima); 
        }
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random() * (canvas.width - 20), Math.random() * (canvas.height - 20), 20, 20);
        this.imagem = new Image();
        this.imagem.src = 'maça.webp';
    }
    
    desenhar() {
        ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }
}



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
    ctx.fillText(`Pontuação Final: ${pontuacao}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`Pontuação Máxima: ${pontuacaoMaxima}`, canvas.width / 2, canvas.height / 2 + 50);
}

function exibirPontuacao() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${pontuacao}`, 20, 30);
    ctx.fillText(`Pontuação Máxima: ${pontuacaoMaxima}`, 20, 60);
}

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        exibirGameOver();
        return; 
    }

    cobra.desenhar();
    if (cobra.atualizar()) { 
        gameOver = true; 
    }
    
    comida.desenhar();
    cobra.verificarColisao(comida);
    exibirPontuacao();

    requestAnimationFrame(loop);
}

loop();