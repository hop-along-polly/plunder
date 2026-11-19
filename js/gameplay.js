const rollD6 = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const rollStormDie = () => {};

const rollMovementDie = () => {};
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Size and port limits for each kind of isle, keyed by plunder points (skulls)
const ISLAND_TYPES = {
  1: { minSize: 2, maxSize: 3, maxPorts: 1 },
  2: { minSize: 3, maxSize: 5, maxPorts: 2 },
  3: { minSize: 7, maxSize: 8, maxPorts: 2 },
  trade: { minSize: 2, maxSize: 3, maxPorts: 1 },
};

const EDGE_GAP = 1;   // sea tiles between an island and the edge o' the map
const ISLAND_GAP = 2; // sea tiles between two islands

const ORTHOGONAL = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Lists the islands needed for a game, biggest first since they be the hardest to fit
 * @param number numPlayers
 * @returns array of island values (3, 2, 1 or 'trade')
 */
const getIslandValues = (numPlayers) => {
  if (numPlayers === 2) {
    return [3, 2, 2, 2, 1, 1, 1, 1];
  }
  return [3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 'trade', 'trade'];
};

/**
 * Grows a single island from a random open tile.
 * @returns array of {r, c} tiles, or null if the island ran aground before reaching its size
 */
const growIsland = (size, rows, cols, blocked) => {
  const isOpen = (r, c) => {
    return r >= EDGE_GAP && r < rows - EDGE_GAP
      && c >= EDGE_GAP && c < cols - EDGE_GAP
      && !blocked[r][c];
  };

  const open = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isOpen(r, c)) open.push({r, c});
    }
  }
  if (open.length === 0) return null;

  const tiles = [open[randInt(0, open.length - 1)]];
  const taken = new Set([`${tiles[0].r},${tiles[0].c}`]);

  while (tiles.length < size) {
    // A tile bordering several island tiles is listed several times, so islands tend to clump
    const frontier = [];
    for (const {r, c} of tiles) {
      for (const [dr, dc] of ORTHOGONAL) {
        const nr = r + dr, nc = c + dc;
        if (isOpen(nr, nc) && !taken.has(`${nr},${nc}`)) frontier.push({r: nr, c: nc});
      }
    }
    if (frontier.length === 0) return null;

    const next = frontier[randInt(0, frontier.length - 1)];
    tiles.push(next);
    taken.add(`${next.r},${next.c}`);
  }

  return tiles;
};

/**
 * Picks the port tiles for an island. Ports sit on the coast and never touch (not even diagonally).
 * Falls back to a single port when the island's shape can't hold 2.
 */
const pickPorts = (tiles, numPorts) => {
  const isIsland = (r, c) => tiles.some(t => t.r === r && t.c === c);
  const coast = shuffle(tiles.filter(({r, c}) => {
    return ORTHOGONAL.some(([dr, dc]) => !isIsland(r + dr, c + dc));
  }));

  if (numPorts === 2) {
    for (let i = 0; i < coast.length; i++) {
      for (let j = i + 1; j < coast.length; j++) {
        const touching = Math.abs(coast[i].r - coast[j].r) <= 1 && Math.abs(coast[i].c - coast[j].c) <= 1;
        if (!touching) return [coast[i], coast[j]];
      }
    }
  }

  return [coast[0]];
};

/**
 * Makes one attempt at placing every island on the map.
 * @returns array of islands, or null if one of them couldn't be placed
 */
const placeIslands = (values, rows, cols) => {
  const blocked = Array(rows).fill().map(() => Array(cols).fill(false));
  const islands = [];

  for (const value of values) {
    const type = ISLAND_TYPES[value];
    const size = randInt(type.minSize, type.maxSize);

    let tiles = null;
    for (let attempt = 0; attempt < 50 && !tiles; attempt++) {
      tiles = growIsland(size, rows, cols, blocked);
    }
    if (!tiles) return null;

    // Keep other islands at least ISLAND_GAP sea tiles away from this one
    for (const {r, c} of tiles) {
      for (let dr = -ISLAND_GAP; dr <= ISLAND_GAP; dr++) {
        for (let dc = -ISLAND_GAP; dc <= ISLAND_GAP; dc++) {
          const nr = r + dr, nc = c + dc;
          if (Math.abs(dr) + Math.abs(dc) <= ISLAND_GAP && nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            blocked[nr][nc] = true;
          }
        }
      }
    }

    const ports = pickPorts(tiles, randInt(1, type.maxPorts));

    islands.push({ value, tiles, ports });
  }

  return islands;
};

/**
 * Generates the islands for the map, starting over whenever the islands can't all be fit.
 */
const generateIslands = (numPlayers, rows, cols) => {
  const values = getIslandValues(numPlayers);
  for (let attempt = 0; attempt < 1000; attempt++) {
    const islands = placeIslands(values, rows, cols);
    if (islands) return islands;
  }
  throw new Error('Arrrgh! Could not chart a map for this voyage');
};

const generateMap = () => {
  const numPlayers = parseInt(localStorage.getItem('num-players'));
  const rows = 12;
  const cols = numPlayers === 2 ? 12 : 18;

  const islands = generateIslands(numPlayers, rows, cols);

  // grid[r][c] is null for sea or {type, icon, skulls} for an island tile
  const grid = Array(rows).fill().map(() => Array(cols).fill(null));
  for (const island of islands) {
    const isTrade = island.value === 'trade';
    for (const tile of island.tiles) {
      let icon = null;
      if (island.ports.includes(tile)) {
        icon = isTrade ? 'fa-database' : 'fa-anchor'; // closest thing to a barrel in free Font Awesome
      }
      grid[tile.r][tile.c] = { type: isTrade ? 'trade' : 'island', icon, skulls: null };
    }

    if (!isTrade) {
      // The skulls float over the island's northern shore, centered on its top row o' tiles
      const topRow = Math.min(...island.tiles.map(t => t.r));
      const topCols = island.tiles.filter(t => t.r === topRow).map(t => t.c);
      const anchorCol = Math.min(...topCols);
      const centerCol = topCols.reduce((sum, c) => sum + c, 0) / topCols.length;
      grid[topRow][anchorCol].skulls = { count: island.value, offset: centerCol - anchorCol };
    }
  }

  let table = $('<table class="gameboard"></table>');

  // Top coordinates
  let topRow = $('<tr></tr>');
  topRow.append('<th></th>');
  for (let c = 0; c < cols; c++) {
    topRow.append(`<th>${c + 1}</th>`);
  }
  topRow.append('<th></th>');
  table.append(topRow);

  // Grid rows
  for (let r = 0; r < rows; r++) {
    let row = $('<tr></tr>');
    row.append(`<th>${String.fromCharCode(65 + r)}</th>`);
    for (let c = 0; c < cols; c++) {
      let cell = grid[r][c];
      let td = $('<td></td>');
      if (!cell) {
        td.addClass('sea');
      } else {
        td.addClass(cell.type);
        if (cell.icon) {
          td.append(`<i class="fas ${cell.icon}"></i>`);
        }
        if (cell.skulls) {
          let skulls = $('<span class="skulls"></span>');
          for (let i = 0; i < cell.skulls.count; i++) {
            skulls.append('<i class="fas fa-skull"></i>');
          }
          // offset is measured in tiles from the left edge of this tile
          skulls.css('left', `${(cell.skulls.offset + 0.5) * 100}%`);
          td.append(skulls);
        }
      }
      row.append(td);
    }
    row.append(`<th>${String.fromCharCode(65 + r)}</th>`);
    table.append(row);
  }

  // Bottom coordinates
  let bottomRow = $('<tr></tr>');
  bottomRow.append('<th></th>');
  for (let c = 0; c < cols; c++) {
    bottomRow.append(`<th>${c + 1}</th>`);
  }
  bottomRow.append('<th></th>');
  table.append(bottomRow);

  $('#gameboard-container').empty().append(table);
};

$(document).ready(() => {
  generateMap();
});