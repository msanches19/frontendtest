let app = Vue.createApp({
  data() {
    return {
      moves: new Set()
    }
  }
})
app.component('square', {
  data() {
    return {
      highlighted: false,
    }
  },
  props: {
    dark: Boolean,
    row: Number,
    col: Number,
    size: Number,
    moves: Set
  },
  methods: {
    getName() {
      const letters = "ABCDEFGH";
      return letters[this.col - 1] + (9 - this.row);
    },
    highlight_square() {
      this.highlighted = !this.highlighted;
      this.moves.add(this.getName())
    }
  },
  template: `
  <div
    @click="highlight_square"
    class="square"
    :class="{ dark: dark, light: !dark, highlight: highlighted}"
    :style="{ width: size + 'vh', height: size + 'vh'}"
  ></div>
`
})
app.component('board', {
  data() {
    return {
      width: 50,
      resize: false,
      xCoord: Number
    }
  },
  props: {
    moves: Set
  },
  methods: {
    startResize(event) {
      this.resize = true;
      this.xCoord = event.clientX;
      window.addEventListener('mouseup', this.endResize);
    }, 
    resizeBoard(event) {
      if (this.resize) {
        this.width = Math.min(Math.max(10, this.width + (event.clientX - this.xCoord) / window.innerWidth * this.width), 85);
      }
    }, 
    endResize(event) {
      this.resize = false;
      window.removeEventListener('mouseup', this.endResize);
    }
  },
  template:`
  <div class='board'
    :style="{ width: width + 'vh', height: width + 'vh' }">
    <div v-for="i in 8" :key="i" class="row">
      <div class=row-container>
        <square v-for="j in 8" :key="j" :dark="(i + j) % 2 == 1" :row="i" :col="j" :size="width/8" :moves="moves"></square>
      </div>
    </div>
    <div class="resize_handler"
      @mousedown="startResize" 
      @mousemove="resizeBoard" 
      @mouseup="endResize">
    </div>
  </div>
`
})
app.component('sidebar', {
  props: {
    moves: Set
  },
  template: `
  <div class="sidebar">
    <ul class="list">
      <li class="move" v-for="move in moves" :key="move"> {{move}}</li>
    </ul>
  </div>
  `
})
app.mount('#app')
