"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ball = __importStar(require("./ball/ball"));
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
