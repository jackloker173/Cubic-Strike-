# Cubic Strike — Trajectory Targeting Game

A browser math game where you plot a missile's flight path by filling in the
coefficients of a cubic equation, `y = ax³ + bx² + cx + d`, to weave between
icebergs and islands and hit a target — all rendered on a radar-style
coordinate grid that shows exact coordinates for every obstacle and target.

No build step, no dependencies. Plain HTML/CSS/JS, runs entirely client-side.

## Play locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How it works

- Each level fixes a firing corridor `x ∈ [-6, 6]`.
- Obstacles (icebergs/islands) and the target are circles with a labeled
  center coordinate and a hit radius.
- You enter `a`, `b`, `c`, `d` and hit **FIRE**. The game samples your curve
  across the domain:
  - If the curve enters the target's radius first → **hit**, level clears.
  - If it enters an obstacle's radius first → **collision**, try again.
  - If it never reaches the target → **miss**.
- Progress (which levels are unlocked) is saved in the browser's
  `localStorage`, per-browser, so it persists between visits.

## Project structure

```
index.html        — page structure, the equation input row
css/style.css      — radar/sonar console visual theme
js/levels.js       — all 10 level definitions (target, obstacles, domain)
js/game.js         — canvas rendering, simulation, collision detection, UI wiring
```

## Adding or editing levels

Open `js/levels.js`. Each entry looks like:

```js
{
  id: 11,
  name: "YOUR LEVEL NAME",
  briefing: "Flavor text shown to the player.",
  domain: [-6, 6],
  target: { x: 6, y: 3, r: 0.5 },       // r = hit tolerance radius
  obstacles: [
    { x: -2, y: 1, r: 1, type: "iceberg" }, // type: "iceberg" | "island" (only affects color)
  ],
  solution: { a: 0, b: 0, c: 0.5, d: 0 }, // a working answer, for your own reference — never shown to players
}
```

A quick way to sanity-check a new level's `solution` actually works before
shipping it (paste into Node):

```js
function f(c, x) { return c.a*x**3 + c.b*x**2 + c.c*x + c.d; }
function check(level) {
  const c = level.solution, [x0, x1] = level.domain;
  for (let x = x0; x <= x1; x += 0.02) {
    const y = f(c, x);
    if (Math.hypot(x - level.target.x, y - level.target.y) <= level.target.r) return "HIT";
    for (const ob of level.obstacles) {
      if (Math.hypot(x - ob.x, y - ob.y) <= ob.r) return "BLOCKED at x=" + x.toFixed(2);
    }
  }
  return "MISS (never reached target)";
}
```

Then just append the new level object to the `LEVELS` array — no other code
changes needed.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (or use an existing one) and push this
   folder's contents to it:

   ```bash
   git init
   git add .
   git commit -m "Cubic Strike: trajectory targeting game"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick branch `main` and folder `/ (root)`, then **Save**.
5. GitHub will publish the site at
   `https://<your-username>.github.io/<your-repo>/` within a minute or two.

No further configuration needed — everything is static files.
