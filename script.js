class Ball {
	constructor() {
		this.r = 10; // diamètre de la balle (en pixels)
		this.x = canvas.width / 2;
		this.y = canvas.height - this.r;
		this.dx = getRandomInt(3, 5);
		this.dy = getRandomInt(-3, -5);
		this.colors = ["#00ffbb", "#ff7f00", "#ff00d0", "#00ff00", "#0037ff", "#eeff00", "#9d00ff"];
		this.rng = Math.floor(Math.random() * this.colors.length);
	}

	draw() { // dessine le cercle et le remplie avec une couleur aléatoire
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fillStyle = this.colors[this.rng];
		ctx.fill();
		ctx.closePath();
	}

	move() { // déplacement de la balle en modifiant ses coordonnées x et y
		this.x += this.dx;
		this.y += this.dy;
	}

	bounce() { // gère les rebonds de la balle avec les paroies de l'écran de jeu et la plateforme
		if (this.x < this.r || this.x > canvas.width - this.r)
			this.dx = -this.dx;

		else if (this.y < canvas.height)
			if (this.y > canvas.height - paddle.height)
				if (this.x > paddle.x && this.x < paddle.x + paddle.width)
					this.dy = -this.dy;

		if (this.y < this.r)
			this.dy = -this.dy;
	}
}

class Paddle {
	constructor() {
		this.width = 80;
		this.height = 10;
		this.x = (canvas.width - this.width) / 2;
	}

	draw() { // dessine un rectangle blanc
		ctx.beginPath();
		ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}

	move() { // permet de déplacer la plateforme horizontalement uniquement dans les limites de largeur du canvas
		if (leftPressed && this.x > this.x / 2)
			this.x -= 7;
		if (rightPressed && this.x < canvas.width - this.width)
			this.x += 7;
	}
}

class Brick {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 75;
		this.height = 20;
		this.touched = false; // si la brique est en contact avec la balle ou non
	}

	draw() { // dessine un rectangle rouge
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}

	destroy(balls) { // gère les collisions entre les balles et les briques
		for (var i = 0; i < balls.length; i++) {
			if (balls[i].x > this.x && balls[i].x < this.x + this.width)

				if (balls[i].y < this.y + this.height && balls[i].y > this.y) {
					this.touched = true;
					ctx.clearRect(this.x, this.y, this.width, this.height); // on efface la brique de l'écran de jeu
					balls[i].dy = -balls[i].dy;

					if (balls.length < 3) // le joueur gagne une balle bonus si il en a moins que 3
						balls.push(new Ball());

					if (balls[i].dy < 0) // la balle qui vient de détruire la brique gagne légèrement en vitesse
						balls[i].dy -= 0.5;

					else if (balls[i].dy > 0) // idem
						balls[i].dy += 0.5;

					balls[i].rng = Math.floor(Math.random() * balls[i].colors.length); // la balle qui vient de détruire la brique change de couleur
					valScore++;
				}
		}
	}
}

function manageBalls(balls) { // gère le tableau de balles en supprimant les balles "perdues"
	for (var i = 0; i < balls.length; i++)
		if (balls[i].y > canvas.height + balls[i].r)
			balls.splice(i, 1);
}

function manageBricks(bricks) { // gère le tableau de briques en supprimant les briques détruites
	for (var i = 0; i < bricks.length; i++)
		if (bricks[i].touched)
			bricks.splice(i, 1);
}

function keyDownHandler(e) { // permet de détecter si les flèches directionelles de gauche ou droite sont enfoncées
	if (e.keyCode === 39)
		rightPressed = true;
	else if (e.keyCode === 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) { // permet de détecter si les flèches directionelles de gauche ou droite sont relachées
	if (e.keyCode === 39)
		rightPressed = false;
	else if (e.keyCode === 37)
		leftPressed = false;
}

function getRandomInt(min, max) { // génère un nombre entier aléatoire entre min (inclus) et max (exclu)
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateScore() { // modifie le contenu HTML de l'élément "score" (un div) avec le nouveau score
	score.innerHTML = valScore;
}

function animate() { // fonction qui prendra en charge tous ce qui concerne l'affichage et la mise à jour de tous les éléments du jeu
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	paddle.draw();
	paddle.move();

	for (var i = 0; i < balls.length; i++) { // on appelle les méthodes "draw" "move" et "bounce" de toutes les balles du tableau de balles
		balls[i].draw();
		balls[i].move();
		balls[i].bounce();
	}

	for (var i = 0; i < bricks.length; i++) { // on appelle les méthodes "draw" et "destroy" de toutes les briques du tableau de briques
		bricks[i].draw();
		bricks[i].destroy(balls);
	}

	manageBalls(balls);
	manageBricks(bricks);
	updateScore();

	if (balls.length === 0) { // défaite
		document.location.reload();
	}

	if (bricks.length === 0) { // victoire
		document.location.reload();
	}
}

var canvas = document.getElementById("canvas"); // cette méthode retourne un élément HTML que nous pouvons ensuite manipuler grâce à différentes méthodes
var ctx = canvas.getContext("2d"); // on utilisera le mode "2d" de l'élément "canvas"

document.addEventListener("keydown", keyDownHandler); // on ajoute un écouteur sur la page qui détectera si une touche est enfoncée
document.addEventListener("keyup", keyUpHandler); // on ajoute un écouteur sur la page qui détectera si une touche est relachée
var leftPressed = false; // au début le joueur n'appuie pas sur les touches
var rightPressed = false; // idem

var score = document.getElementById("score"); // on récupère le div "score" pour pouvoir le modifier en temps réel lors de la partie
var valScore = 0;

var balls = [];
var paddle = new Paddle();
var bricks = [];

for (var i = 0; i < 1; i++) // Au début du jeu le joueur ne dispose que d'une balle
	balls[i] = new Ball();

var x = 30;
var y = 70;
for (var i = 0; i < 21; i++) { // Disposition des briques
	bricks[i] = new Brick(x, y);
	x += 100;
	if (i !== 0 && i % 10 === 0) {
		y = 100;
		x = 30;
	}
}

setInterval(animate, 10); // éxécute la fonction animate toutes les 10 milisecondes