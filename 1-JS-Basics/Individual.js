import {WIDTH, HEIGHT} from './constants.js';

/**
 * Represents an individual in the simulation.
 *
 * Every individual has a position (initialized randomly), speed, size, and
 * color. The base class handles drawing the individual on the canvas. The base
 * class update method does nothing by default, allowing subclasses to implement
 * their own behavior.
 */
export class Individual {
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
     * Ensures the individual stays within the bounds of the canvas.
     */
    ensureInBounds() {
        this.x = Math.max(this.size / 2, Math.min(this.x, WIDTH - this.size / 2));
        this.y = Math.max(this.size / 2, Math.min(this.y, HEIGHT - this.size / 2));
    }

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

    /**
     * Get the closest Individual of a certain type.
     * @param {Function} type - The constructor of the type to find.
     * @param {[[Individual, number]]} distances - The distances map.
     * @returns {[Individual, number]|null} The closest individual of the
     * specified type and its distance, or null if not found.
     */
    getClosestOfType(type, distances) {
        for (const [individual, dist] of distances) {
            if (individual instanceof type) {
                return [individual, dist];
            }
        }
        return [null, null];
    }

    /**
     * Moves the individual towards a target Individual/position.
     * @param {Individual} target - The target individual to move towards.
     */
    moveTowards(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    /**
     * Moves the individual away from a target Individual/position.
     * @param {Individual} target - The target individual to move away from.
     */
    moveAway(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            this.x -= (dx / dist) * this.speed;
            this.y -= (dy / dist) * this.speed;
        }
    }
}
