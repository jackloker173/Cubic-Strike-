// LEVELS.JS
// Domain is fixed at x ∈ [-6, 6] for every level (the "firing corridor").
// Each level is solvable — a working (a,b,c,d) is included as `solution`
// purely for designer reference / potential "show solution" debug mode.
// It is never shown to the player during normal play.

const LEVELS = [
  {
    id: 1,
    name: "CALM WATER",
    briefing: "No obstacles worth mentioning. Get a feel for the launch tube. Adjust c to set your heading, d to set your starting depth.",
    domain: [-6, 6],
    target: { x: 5, y: 5, r: 0.7 },
    obstacles: [
      { x: -3, y: 3, r: 0.8, type: "iceberg" },
      { x: 2, y: -3, r: 0.8, type: "island" },
    ],
    solution: { a: 0, b: 0, c: 1, d: 0 },
  },
  {
    id: 2,
    name: "RISING TIDE",
    briefing: "The target is above your launch line. d moves your whole path up or down — use it to clear what's sitting near your bow.",
    domain: [-6, 6],
    target: { x: 6, y: 5, r: 0.65 },
    obstacles: [
      { x: 1, y: 0, r: 0.8, type: "island" },
      { x: -4, y: 4, r: 1, type: "iceberg" },
    ],
    solution: { a: 0, b: 0, c: 0.5, d: 2 },
  },
  {
    id: 3,
    name: "BLOCKED LANE",
    briefing: "A straight shot runs right through that iceberg. Bring in b to bend the path around it.",
    domain: [-6, 6],
    target: { x: 5, y: 1, r: 0.6 },
    obstacles: [
      { x: 2.5, y: 0.5, r: 1, type: "iceberg" },
      { x: -3, y: -3, r: 1, type: "island" },
    ],
    solution: { a: 0, b: 0.25, c: -1.05, d: 0 },
  },
  {
    id: 4,
    name: "TWO ROCKS",
    briefing: "Obstacles on both sides of the corridor now. Thread the gap between them before diving to the target.",
    domain: [-6, 6],
    target: { x: 5, y: -3, r: 0.6 },
    obstacles: [
      { x: -2, y: -2, r: 1, type: "iceberg" },
      { x: 2, y: 2, r: 1, type: "island" },
    ],
    solution: { a: 0, b: -0.1, c: -0.1, d: 0 },
  },
  {
    id: 5,
    name: "THE WEAVE",
    briefing: "Up, then down, then up again. This is where the cubic term (a) starts to earn its keep.",
    domain: [-6, 6],
    target: { x: 5, y: 4, r: 0.55 },
    obstacles: [
      { x: -1, y: -2, r: 1, type: "iceberg" },
      { x: 2, y: 2, r: 1, type: "island" },
    ],
    solution: { a: -0.011, b: 0.428, c: -1.061, d: 0 },
  },
  {
    id: 6,
    name: "PICKET LINE",
    briefing: "Three obstacles strung out across the corridor. Plan the whole path before you fire — you can't adjust mid-flight.",
    domain: [-6, 6],
    target: { x: 6, y: -4, r: 0.5 },
    obstacles: [
      { x: -3, y: 1, r: 1, type: "iceberg" },
      { x: 0, y: -2, r: 1, type: "island" },
      { x: 3, y: 1.5, r: 1, type: "iceberg" },
    ],
    solution: { a: 0.0278, b: -0.25, c: -0.3333, d: 1 },
  },
  {
    id: 7,
    name: "NARROW STRAIT",
    briefing: "Four obstacles now, and the gaps are tighter. Read the coordinates carefully before you commit.",
    domain: [-6, 6],
    target: { x: 6, y: 4, r: 0.5 },
    obstacles: [
      { x: -4, y: -1, r: 1, type: "iceberg" },
      { x: -1, y: 2, r: 1, type: "island" },
      { x: 2, y: -2, r: 1, type: "iceberg" },
      { x: 4.5, y: 1, r: 0.8, type: "island" },
    ],
    solution: { a: 0.0018, b: 0.1054, c: -0.0107, d: -0.1143 },
  },
  {
    id: 8,
    name: "DEEP FIELD",
    briefing: "A wider spread of ice and rock. The target sits further out — small coefficient errors get magnified over distance.",
    domain: [-6, 6],
    target: { x: 6, y: 5, r: 0.4 },
    obstacles: [
      { x: 0, y: 2, r: 1, type: "island" },
      { x: -4, y: -1, r: 1, type: "iceberg" },
      { x: 3, y: 0.5, r: 1, type: "island" },
      { x: -2, y: -3, r: 0.9, type: "iceberg" },
    ],
    solution: { a: 0.0464, b: 0.0821, c: -1.1643, d: -1 },
  },
  {
    id: 9,
    name: "GRAVEYARD",
    briefing: "Five hazards, small target. This one takes real planning — trace your intended path on paper before entering numbers.",
    domain: [-6, 6],
    target: { x: 6, y: -3, r: 0.35 },
    obstacles: [
      { x: 0, y: -2, r: 1, type: "island" },
      { x: -4, y: 1.5, r: 1, type: "iceberg" },
      { x: 3, y: -1, r: 1, type: "island" },
      { x: -1.5, y: 3, r: 0.9, type: "iceberg" },
      { x: 4.5, y: 2, r: 0.7, type: "iceberg" },
    ],
    solution: { a: -0.0361, b: -0.0361, c: 0.9333, d: 0.5 },
  },
  {
    id: 10,
    name: "FINAL APPROACH",
    briefing: "Full field. Full precision required. This is the last gate before open water — good luck, operator.",
    domain: [-6, 6],
    target: { x: 6, y: 4, r: 0.3 },
    obstacles: [
      { x: 0, y: 2, r: 1, type: "island" },
      { x: -5, y: -1.2, r: 1, type: "iceberg" },
      { x: 2, y: 0.3, r: 0.9, type: "island" },
      { x: -2, y: 3, r: 0.9, type: "iceberg" },
      { x: 4, y: -2.5, r: 0.9, type: "island" },
    ],
    solution: { a: 0.0399, b: 0.0555, c: -1.0208, d: -0.5 },
  },
];
