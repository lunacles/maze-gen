import Maze from './maze.js'
import QuadTree from '../toolbox/quadtree.js'
import * as util from '../toolbox/util.js'

const QuadTreeCave = class {
  constructor({ width, height, fill = false, mazeSeed = '' } = {}) {
    this.map = new Maze(width, height, mazeSeed, fill++)
    this.width = width
    this.height = height
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      capacity: 3,
    })
    this.seed = mazeSeed
    this.util =  this.map.seedUtils
  }
  init() {
    this.fill(32)
    this.fillBorders(this.quadTree.boundaries)
    this.cellularAutomata()
    
    this.map.combineWalls()
    this.map.placeWalls()
  }
  fill(amount) {
    let random = i => Math.floor(this.util.nextFloat() * Math.floor(i))
    let used = new Set()
    for (let i = 0; i < amount; i++) {
      let ii = 0
      while (true != false) {
        ii++
        // Apply Retard Protection IV
        if (ii > 1e3) throw Error('Loop overflow')
        let x = random(this.width)
        let y = random(this.height)
        let key = `${x},${y}`
        
        if (used.has(key)) continue
        used.add(key)
        this.quadTree.insert({ x, y })
        ii = 0
        break
      }
    }
  }
  fillBorders(boundaries) {
    for (let boundary of boundaries) {
      if (boundary.boundaries && boundary.boundaries.length > 0) {
        this.fillBorders(boundary.boundaries)
      } else {
        let maxX = boundary.x + (boundary.width - 1)
        let maxY = boundary.y + (boundary.height - 1)
        
        let width = Math.floor(boundary.width * util.clamp(this.util.nextFloat(), 0.2, 0.4) * 0.5)
        let height = Math.floor(boundary.height * util.clamp(this.util.nextFloat(), 0.2, 0.5) * 0.5)

        for (let y = boundary.y + height; y < maxY - height; y++) {
          for (let x = boundary.x + width; x < maxX - width; x++) {
            if (this.util.nextFloat() > 0.3 && this.map.has(x, y))
              this.map.set(x, y, 0)
          }
        }
      }
    }
  }
  cellularAutomata() {
    for(let i = 0; i < 7; i++) {
      for (let [x, y, value] of this.map.entries()) {
        if (x === 0 || y === 0 || x === this.map.width - 1 || y === this.map.height - 1) continue
        let adjacentWalls = 0
        
        for (let ix = x - 1; ix <= x + 1; ix++) {
          for (let iy = y - 1; iy <= y + 1; iy++) {
            if (this.map.get(ix, iy))
              adjacentWalls++
          }
        }
        adjacentWalls += this.map.get(x, y)

        let nearbyWalls = 0
        
        for (let ix = x - 2; ix <= x + 2; ix++) {
          for (let iy = y - 2; iy <= y + 2; iy++) {
            if (Math.abs(ix - x) === 2 && Math.abs(iy - y) === 2) continue
            if (ix < 0 || iy < 0 || ix >= this.map.width || iy >= this.map.height) continue
            if (this.map.get(ix, iy))
              nearbyWalls++
          }
        }
        
        let v = adjacentWalls >= 5 || nearbyWalls <= 2
        this.map.set(x, y, v++)
      }
    }
  }
}

export default QuadTreeCave
