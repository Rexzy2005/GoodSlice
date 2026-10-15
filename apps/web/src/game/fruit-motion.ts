/** Presentation physics for the local cutting sandbox, not authoritative round rules. */
export interface FruitMotion {
  x: number; y: number; vx: number; vy: number;
  angle: number; spin: number; gravity: number;
}
export function launchFruit(width: number, height: number, radius: number, random: () => number = Math.random): FruitMotion {
  const x = width * (.2 + random() * .6);
  const y = height + radius * 1.5;
  const apex = height * (.18 + random() * .24);
  const gravity = height * 1.65;
  const vy = -Math.sqrt(2 * gravity * (y - apex));
  const timeToApex = -vy / gravity;
  const targetX = width * (.25 + random() * .5);
  return { x, y, vx: (targetX - x) / (timeToApex * 2), vy, gravity, angle: random() * Math.PI * 2, spin: (random() - .5) * 3.2 };
}
/** Exact constant-acceleration integration makes arcs independent of refresh rate. */
export function advanceFruit(body: FruitMotion, seconds: number): void {
  body.x += body.vx * seconds;
  body.y += body.vy * seconds + .5 * body.gravity * seconds * seconds;
  body.vy += body.gravity * seconds;
  body.angle += body.spin * seconds;
}
export function splitFruit(body: FruitMotion, swipeAngle: number): [FruitMotion, FruitMotion] {
  const normalX = -Math.sin(swipeAngle), normalY = Math.cos(swipeAngle);
  const half = (direction: number): FruitMotion => ({
    ...body, x: body.x + normalX * direction * 5, y: body.y + normalY * direction * 5,
    vx: body.vx + normalX * direction * 115, vy: body.vy + normalY * direction * 115,
    angle: swipeAngle, spin: direction * 2.4,
  });
  return [half(-1), half(1)];
}
