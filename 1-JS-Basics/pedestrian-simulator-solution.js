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
    /**
     * Creates an instance of the Individual class.
     * @param {number} speed - The speed of the individual.
     * @param {number} size - The size of the individual.
     * @param {string} color - The color of the individual.
     */
    constructor(speed, size, color) {
        this.x = Math.random() * (WIDTH - size * 2) + size;
        this.y = Math.random() * (HEIGHT - size * 2) + size;
        this.speed = speed;
        this.size = size;
        this.color = color;
    }
    /**
     * Draws the individual on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    /**
     * Updates the individual's state. The base class implementation does
     * nothing.
     * @param {[[Individual, number]]} distances - A list of all other
     * individuals and their distances to this individual.
     * @param {Simulation} simulation - The simulation instance.
     */
    update(distances, simulation) { }  // eslint-disable-line no-unused-vars
    /**
     * Computes the distance to another individual.
     * @param {Individual} other - The other individual.
     * @returns {number} The distance to the other individual.
     */
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * Represents a zombie in the simulation. A zombie has a speed and moves
 * randomly. The default color is red.
 */
class Zombie extends Individual {
    /**
     * Creates an instance of the Zombie class.
     * @param {number} speed - The speed of the zombie.
     * @param {number} x - The optional initial x position of the zombie.
     * @param {number} y - The optional initial y position of the zombie.
     */
    constructor(speed, x, y) {
        super(speed, 5, '#F44336');
        if (x != null) {
            this.x = x;
            this.y = y;
        }
    }

    update() {  // does not use distances/simulation
        // Update position
        this.x += (Math.random() * 2 - 1) * this.speed;
        this.y += (Math.random() * 2 - 1) * this.speed;

        // Hit walls
        if (this.x < this.size/2 || this.x > WIDTH - this.size/2) {
            this.x = Math.max(this.size/2, Math.min(this.x, WIDTH - this.size/2));
        }
        if (this.y < this.size/2 || this.y > HEIGHT - this.size/2) {
            this.y = Math.max(this.size/2, Math.min(this.y, HEIGHT - this.size/2));
        }
    }
}

/**
 * Represents a person in the simulation. A person has a speed they are moving
 * and bounces off of walls. The default color is green.
 */
class Person extends Individual {
    /**
     * Creates an instance of the Person class.
     * @param {number} speed - The speed of the person.
     */
    constructor(speed) {
        super(speed, 5, '#4CAF50');
        this.dx = (Math.random() - 0.5) * speed;
        this.dy = (Math.random() - 0.5) * speed;
    }

    update(distances, simulation) {
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

        // Check for infection
        for (const [individual, dist] of distances) {
            if (dist > simulation.infectionDistance) break; // since distances are sorted
            if (individual instanceof Zombie) {
                const index = simulation.individuals.indexOf(this);
                if (index !== -1) {
                    simulation.individuals[index] = new Zombie(this.speed, this.x, this.y);
                }
            }
        }
    }
}

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
            this.individuals.push(new Person(speed));
        }
        for (let i = 0; i < numZombies; i++) {
            this.individuals.push(new Zombie(speed));
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
