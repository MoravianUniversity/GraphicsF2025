const WIDTH = 800;
const HEIGHT = 600;
const BACKGROUND_COLOR = '#000';

/**
 * Represents an individual in the simulation.
 *
 * Every individual has a position (initialized randomly), speed, size, and
 * color. The base class handles drawing the individual on the canvas. The base
 * class update method does nothing by default, allowing subclasses to implement
 * their own behavior.
 */
class Individual {
    constructor(speed, size, color) {
        this.x = Math.random() * (WIDTH - size * 2) + size;
        this.y = Math.random() * (HEIGHT - size * 2) + size;
        this.speed = speed;
        this.size = size;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() { }
}

/**
 * Represents a person in the simulation. A person has a speed they are moving
 * and bounces off of walls. The default color is green.
 */
class Person extends Individual {
    constructor(speed) {
        super(speed, 5, '#4CAF50');
        this.dx = (Math.random() - 0.5) * speed;
        this.dy = (Math.random() - 0.5) * speed;
    }
    update() {
        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x < this.size/2 || this.x > WIDTH - this.size/2) {
            this.dx *= -1;
            this.x = Math.max(this.size/2, Math.min(this.x, WIDTH - this.size/2));
        }
        if (this.y < this.size/2 || this.y > HEIGHT - this.size/2) {
            this.dy *= -1;
            this.y = Math.max(this.size/2, Math.min(this.y, HEIGHT - this.size/2));
        }

        // Apply random acceleration
        this.dx += (Math.random() * .05*this.speed) - .025*this.speed;
        this.dy += (Math.random() * .05*this.speed) - .025*this.speed;

        // Limit overall speed
        const overall_speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
        if (overall_speed > this.speed) {
            this.dx *= this.speed/overall_speed;
            this.dy *= this.speed/overall_speed;
        }
    }
}

/**
 * The entire simulation.
 */
class Simulation {
    #ctx = null;
    #individuals = [];
    #isRunning = false;
    #animationId = null;
    #startBtn;
    #pauseBtn;
    #resetBtn;
    #numPeopleElem;
    #speedElem;

    /**
     * Creates a new simulation.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    constructor(
        ctx,
        startBtn,
        pauseBtn,
        resetBtn,
        numPeopleElem,
        speedElem
    ) {
        this.#ctx = ctx;
        this.#startBtn = startBtn;
        this.#pauseBtn = pauseBtn;
        this.#resetBtn = resetBtn;
        this.#numPeopleElem = numPeopleElem;
        this.#speedElem = speedElem;
    }

    /**
     * Sets up event listeners for the simulation controls.
     */
    setup() {
        this.#startBtn.addEventListener('click', () => this.start());
        this.#pauseBtn.addEventListener('click', () => this.pause());
        this.#resetBtn.addEventListener('click', () => this.reset());
    }

    /**
     * Draws the current state of the simulation.
     */
    draw() {
        // Clear canvas
        this.#ctx.fillStyle = BACKGROUND_COLOR;
        this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

        // Draw all people
        for (const individual of this.#individuals) {
            individual.draw(this.#ctx);
        }
    }

    /**
     * Updates the state of the simulation.
     */
    #update() {
        // Update all individuals
        for (const individual of this.#individuals) {
            individual.update();
        }
    }

    /**
     * Starts the simulation if it is not already running.
     */
    start() {
        if (!this.#isRunning) {
            this.#isRunning = true;
            this.#startBtn.disabled = true;
            this.#pauseBtn.disabled = false;
            this.#animate();
        }
    }

    /**
     * Animates the simulation.
     */
    #animate() {
        // If the simulation is running, update and draw the people
        if (this.#isRunning) {
            this.#update();
            this.draw();
            // Request the next animation frame
            this.#animationId = requestAnimationFrame(() => this.#animate());
        }
    }

    /**
     * Pauses the simulation.
     */
    pause() {
        this.#isRunning = false;
        this.#startBtn.disabled = false;
        this.#pauseBtn.disabled = true;
        if (this.#animationId) {
            // Stop the animation (which also stops the updating)
            cancelAnimationFrame(this.#animationId);
            this.#animationId = null;
        }
    }

    /**
     * Resets the simulation, regenerating all individuals based on the
     * currently defined parameters.
     */
    reset() {
        this.pause();

        // Get simulation parameters
        const numPeople = +this.#numPeopleElem.value;
        const speed = +this.#speedElem.value;

        // Create all of the people after clearing the list of people
        this.#individuals.length = 0;
        for (let i = 0; i < numPeople; i++) {
            this.#individuals.push(new Person(speed));
        }

        // Draw the initial state
        this.draw();
    }
}

/**
 * Initializes the simulation by setting up the canvas context and event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('simulationCanvas').getContext('2d');
    const simulation = new Simulation(ctx,
        document.getElementById('startBtn'),
        document.getElementById('pauseBtn'),
        document.getElementById('resetBtn'),
        document.getElementById('numPeople'),
        document.getElementById('speed')
    );
    simulation.setup();
    simulation.reset();
});
