import { Individual } from "./Individual.js";
import { Person } from "./Person.js";

/**
 * Represents a zombie in the simulation. A zombie has a speed and moves
 * randomly. The default color is red.
 */
export class Zombie extends Individual {
    /**
     * Creates an instance of the Zombie class.
     * @param {number} speed - The speed of the zombie.
     * @param {number} x - The optional initial x position of the zombie.
     * @param {number} y - The optional initial y position of the zombie.
     */
    constructor(speed, x, y, color='#F44336') {
        super(speed, 5, color);
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
        this.ensureInBounds();
    }
}

export class Seeker extends Zombie {
    constructor(speed, x, y) {
        super(speed, x, y, '#ff3efc');
    }

    update(distances) {
        const [person] = this.getClosestOfType(Person, distances);
        if (person) {
            this.moveTowards(person);
        }
    }
}

/**
 * Creates a zombie instance based on the given speed. It has a 5% chance
 * to be a seeker.
 * @param {number} speed - The speed of the zombie.
 * @returns {Zombie|Seeker} A new zombie or seeker instance.
 */
export function createZombie(speed) {
    const rand = Math.random();
    if (rand < 0.05) {
        return new Seeker(speed);
    } else {
        return new Zombie(speed);
    }
}