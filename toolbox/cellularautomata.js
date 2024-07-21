const CellularAutomata = class {
  constructor(map) {
    this.map = map
  }
  neighbours(x, y, range) {
    let count = 0
    for (let iy = y - range; iy <= y + range; iy++) {
      for (let ix = x - range; ix <= x + range; ix++) {
        if (
          (ix !== x || iy !== y) && 
          (this.map.has(ix, iy) || this.map.get(ix, iy) === 1)
        ) {
          count++
        }
      }
    }
    return count
  }
  evolve(type, final = false) {
    for (let y = 0; y <= this.map.height - 1; y++) {
      for (let x = 0; x <= this.map.width - 1; x++) {
        let nearbyNeighbors = this.neighbours(x, y, 1)
        let adjacentNeighbors = this.neighbours(x, y, 2)
        
        this.map.set(x, y, +this.validateAutomata(type, {
          x,
          y,
          adjacentNeighbors,
          nearbyNeighbors,
          final,
        }))
      }
    }
  }
  validateAutomata(type, config) {
    switch (type) {
      case '1':
        return config.adjacentNeighbors >= 21 || config.nearbyNeighbors <= 3
      case '2':
        return config.adjacentNeighbors <= 7 || config.nearbyNeighbors >= 6
      case '3':
        if (this.map.has(ix, iy) && this.map.get(ix, iy) === 1) {
          return config.adjacentNeighbors <= 12
        } else if (config.final) {
          return config.adjacentNeighbors <= 17 || config.nearbyNeighbors >= 7
        } else {
          return config.adjacentNeighbors <= 17 || config.nearbyNeighbors >= 7
        }
    }
  }
}

export default CellularAutomata
