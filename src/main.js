import './style.css'
import { Game } from './Game.js'

const app = document.querySelector('#app');
const game = new Game(app);
game.initialize();
