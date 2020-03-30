import * as ball from "./ball/ball";

function setup() {
	ball.create_ball();
	// create_bricks();
	// create_paddle();
}

function update() {
	// move_ball();
	ball.bounce();
	// move_paddle();
	// destroy_bricks();
}

function render() {
	// draw_ball();
	// draw_bricks();
	// draw_paddle();
}

setup();
update();
