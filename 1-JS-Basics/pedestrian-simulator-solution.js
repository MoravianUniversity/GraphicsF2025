import { BACKGROUND_COLOR } from './constants.js';
import { createPerson } from './Person.js';
import { createZombie } from './Zombie.js';

/**
 * The entire simulation.
 */
class Simulation {
    #ctx = null;
    individuals = [];
    #isRunning = false;
    #animationId = null;
    #startBtn;
    #pauseBtn;
    #resetBtn;
    #numPeopleElem;
    #numZombiesElem;
    #infectionDistanceElem;
    infectionDistance;
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
        numZombiesElem,
        infectionDistanceElem,
        speedElem
    ) {
        this.#ctx = ctx;
        this.#startBtn = startBtn;
        this.#pauseBtn = pauseBtn;
        this.#resetBtn = resetBtn;
        this.#numPeopleElem = numPeopleElem;
        this.#numZombiesElem = numZombiesElem;
        this.#infectionDistanceElem = infectionDistanceElem;
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
        for (const individual of this.individuals) {
            individual.draw(this.#ctx);
        }
    }

    /**
     * Updates the state of the simulation.
     */
    #update() {
        // Compute distances
        const distances = this.#computeDistances();

        // Update all individuals
        for (const individual of this.individuals) {
            individual.update(distances.get(individual), this);
        }
    }

    /**
     * Removes an individual from the simulation.
     * @param {Individual} individual 
     */
    remove(individual) {
        const index = this.individuals.indexOf(individual);
        if (index !== -1) {
            this.individuals.splice(index, 1);
        }
    }

    /**
     * Compute all pairwise distances between individuals.
     * @returns {Map<Individual, [[Individual, number]]} A map of all
     * individuals to lists of their distances to other individuals. The lists
     * are sorted in ascending order by distance.
     */
    #computeDistances() {
        // Create a map to hold distances
        const distances = new Map();
        for (const individual of this.individuals) {
            distances.set(individual, []);
        }
        // Compute all pairwise distances
        for (let i = 0; i < this.individuals.length; i++) {
            const a = this.individuals[i];
            for (let j = i + 1; j < this.individuals.length; j++) {
                const b = this.individuals[j];
                const dist = a.distance(b);
                distances.get(a).push([b, dist]);
                distances.get(b).push([a, dist]);
            }
        }
        // Sort distances
        for (const individual of this.individuals) {
            distances.get(individual).sort((a, b) => a[1] - b[1]);
        }
        return distances;
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
        const numZombies = +this.#numZombiesElem.value;
        const speed = +this.#speedElem.value;
        this.infectionDistance = +this.#infectionDistanceElem.value;

        // Create all of the people after clearing the list of people
        this.individuals.length = 0;
        for (let i = 0; i < numPeople; i++) {
            this.individuals.push(createPerson(speed));
        }
        for (let i = 0; i < numZombies; i++) {
            this.individuals.push(createZombie(speed));
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
        document.getElementById('numZombies'),
        document.getElementById('infectionDistance'),
        document.getElementById('speed')
    );
    simulation.setup();
    simulation.reset();
});
