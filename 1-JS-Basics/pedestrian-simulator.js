const SPEED = 2;
const WIDTH = 800;
const HEIGHT = 600;
const BACKGROUND_COLOR = '#000';
const PERSON_SIZE = 5;
const PERSON_COLOR = '#4CAF50';

let isRunning = false;
let animationId = null;
const people = [];
let ctx = null;

/**
 * Creates a new person object with random position and direction.
 * @returns {Object} A new person object with random position and direction.
 */
function createPerson() {
    return {
        x: Math.random() * (WIDTH - PERSON_SIZE * 2) + PERSON_SIZE,
        y: Math.random() * (HEIGHT - PERSON_SIZE * 2) + PERSON_SIZE,
        dx: (Math.random() - 0.5) * SPEED,
        dy: (Math.random() - 0.5) * SPEED,
    }
}

/**
 * Draws a person on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
 * @param {Object} person - The person object containing their x/y position.
 */
function drawPerson(ctx, person) {
    ctx.fillStyle = PERSON_COLOR;
    ctx.beginPath();
    ctx.arc(person.x, person.y, PERSON_SIZE, 0, 2 * Math.PI);
    ctx.fill();
}

/**
 * Draws the simulation on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
 */
function draw(ctx, people) {
    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // TODO: Draw all people
}

/**
 * Updates the position and direction of a person.
 * @param {Object} person - The person object to update.
 */
function updatePerson(person) {
    // Update position
    person.x += person.dx;
    person.y += person.dy;
}

/**
 * Updates the position and direction of all people.
 * @param {Array} people - The array of person objects to update.
 */
function update(people) {
    // TODO: Update all of the people
}

/**
 * Starts the simulation by starting the animation loop.
 */
function start() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        animate();
    }
}

/**
 * Animation loop that updates and draws the simulation.
 * It uses requestAnimationFrame for smooth animations.
 */
function animate() {
    // If the simulation is running, update and draw the people
    if (isRunning) {
        update(people);
        draw(ctx, people);
        // Request the next animation frame
        animationId = requestAnimationFrame(animate);
    }
}

/**
 * Pauses the simulation by stopping the animation loop.
 */
function pause() {
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    if (animationId) {
        // Stop the animation (which also stops the updating)
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

/**
 * Resets the simulation by clearing the canvas and creating new people.
 */
function reset() {
    pause();

    const numPeople = +document.getElementById('numPeople').value;
    // TODO: Create all of the people after clearing the list of people

    // TODO: Draw the initial state
}

/**
 * Initializes the simulation by setting up the canvas context and event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    ctx = document.getElementById('simulationCanvas').getContext('2d');
    document.getElementById('startBtn').addEventListener('click', () => start());
    document.getElementById('pauseBtn').addEventListener('click', () => pause());
    document.getElementById('resetBtn').addEventListener('click', () => reset());
    reset();
});
