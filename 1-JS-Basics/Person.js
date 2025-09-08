import { WIDTH, HEIGHT } from "./constants.js";
import { Individual } from "./Individual.js";
import { Zombie } from "./Zombie.js";

/**
 * Represents a person in the simulation. A person has a speed they are moving
 * and bounces off of walls. The default color is green.
 */
export class Person extends Individual {
    /**
     * Creates an instance of the Person class.
     * @param {number} speed - The speed of the person.
     */
    constructor(speed, color='#4CAF50') {
        super(speed, 5, color);
        this.dx = (Math.random() - 0.5) * speed;
        this.dy = (Math.random() - 0.5) * speed;
    }

    move() {
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

    zombify(simulation) {
        const index = simulation.individuals.indexOf(this);
        if (index !== -1) {
            simulation.individuals[index] = new Zombie(this.speed, this.x, this.y);
        }
    }

    maybeZombify(distances, simulation, range) {
        range = range ?? simulation.infectionDistance;
        for (const [individual, dist] of distances) {
            if (dist > range) break; // since distances are sorted
            if (individual instanceof Zombie) {
                this.zombify(simulation);
                break;
            }
        }
    }

    removeClosestZombie(distances, simulation, range) {
        range = range ?? simulation.infectionDistance + 1.5*this.speed;
        for (const [individual, dist] of distances) {
            if (dist > range) break; // since distances are sorted
            if (individual instanceof Zombie) {
                const index = simulation.individuals.indexOf(individual);
                if (index !== -1) {
                    simulation.individuals.splice(index, 1);
                }
            }
        }
    }

    update(distances, simulation) {
        this.move();
        this.maybeZombify(distances, simulation);
    }
}

export class Defender extends Person {
    constructor(speed) {
        super(speed, '#2196F3');
    }

    update(distances, simulation) {
        this.move();
        this.removeClosestZombie(distances, simulation);
        this.maybeZombify(distances, simulation);
    }
}

export class Hunter extends Person {
    constructor(speed) {
        super(speed, '#ffbb00');
    }

    update(distances, simulation) {
        const [zomb] = this.getClosestOfType(Zombie, distances);
        if (zomb != null) {
            this.moveTowards(zomb);
            this.removeClosestZombie(distances, simulation);
            this.maybeZombify(distances, simulation);
        }
    }
}

export class Runner extends Person {
    constructor(speed) {
        super(speed, '#00bcd4');
    }

    update(distances, simulation) {
        const [zomb] = this.getClosestOfType(Zombie, distances);
        if (zomb != null) {
            this.moveAway(zomb);
            this.ensureInBounds();
            this.maybeZombify(distances, simulation);
        }
    }
}

/**
 * Creates a person instance based on the given speed. It has a 10% chance
 * to be a defender, a 5% chance to be a hunter, and a 15% chance to be a
 * runner.
 * @param {number} speed - The speed of the person.
 * @returns {Person} A new person instance.
 */
export function createPerson(speed) {
    const rand = Math.random();
    if (rand < 0.1) {
        return new Defender(speed);
    } else if (rand < 0.15) {
        return new Hunter(speed);
    } else if (rand < 0.3) {
        return new Runner(speed);
    } else {
        return new Person(speed);
    }
}
