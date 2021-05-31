<template>
  <div id="app">
    <div class="game-field">
      <span :class="blueActive" v-on:click="isInputData(1)"></span>
      <span :class="redActive" v-on:click="isInputData(2)"></span>
      <span :class="yellowActive" v-on:click="isInputData(3)"></span>
      <span :class="greenActive" v-on:click="isInputData(4)"></span>
    </div>
    <div class="set-level">
      <label for="easy">
        <input name="level" id="easy" value="easy" type="radio" v-model="level"> Легко
      </label>
      <label for="middle">
        <input name="level" id="middle" value="middle" type="radio" v-model="level" > Средне
      </label>
      <label for="hard">
        <input name="level" id="hard" value="hard" type="radio" v-model="level"> Сложно
      </label>
    </div>
    <button class="round" v-on:click="startStop">{{ buttonText }}</button>
    <b class="round">Раунд: {{ round }}</b>
    <p class="round">Колличество отгаданных чисел раунда: {{countUserInput}} из {{ round }}</p>
    <p class="info">{{ textInfo }}</p>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      textStart: "Старт!",
      textStop: "Стоп!",
      textInfo: "",

      level: "easy",
      levelTime: 1.5,

      isPlaying: false,
      buttonText: "Старт!",
      round: 0,

      colors: ["blue", "red", "yellow", "green"],
      isActiveBlue: false,
      isActiveRed: false,
      isActiveYellow: false,
      isActiveGreen: false,
      randArray: [],
      countUserInput: 0
    }
  },

  computed: {
    blueActive: function (){
      return this.isActiveBlue ? 'blue active-blue' : 'blue'
    },
    redActive: function (){
      return this.isActiveRed ? 'red active-red' : 'red'
    },
    yellowActive: function (){
      return this.isActiveYellow ? 'yellow active-yellow' : 'yellow'
    },
    greenActive: function (){
      return this.isActiveGreen ? 'green active-green' : 'green'
    }
  },

  methods: {
    sleep: function (ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    isInputData: function (value){
      if(this.randArray[this.countUserInput] === value) {
        this.countUserInput += 1
        this.sleep(this.levelTime);
        this.clearActive();
      }
      else {
        this.startStop()
        this.textInfo = "Раунд не пройден! Нажмите ОК для продолжения"
      }

      if(this.randArray.length === this.countUserInput) {
        this.randArray = []
        this.countUserInput = 0
        this.round += 1
        this.clearActive()
        //alert("Раунд пройден! Нажмите ОК для продолжения")
        this.startRound()
      }
    },
    setLevelTime: function (){
      if(this.level === "easy") this.levelTime = 1500
      if(this.level === "middle") this.levelTime = 1000
      if(this.level === "hard") this.levelTime = 400
    },

    generateRandArray: function (){
      this.randArray = []

      for(let i = 0; i < this.round; ++i)
        this.randArray.push(Math.floor((Math.random() * 4) + 1));
    },

    clearActive: function (){
      this.isActiveBlue = false
      this.isActiveRed = false
      this.isActiveYellow = false
      this.isActiveGreen = false
    },

    startRound: async function (){
      this.generateRandArray()

      await this.sleep(this.levelTime);

      for(let i = 0; i < this.round; ++i) {
        let index = this.randArray[i]

        switch (index) {
          case 1: this.isActiveBlue = true; break;
          case 2: this.isActiveRed = true; break;
          case 3: this.isActiveYellow = true; break;
          case 4: this.isActiveGreen = true; break;
        }

        await this.sleep(this.levelTime);
        this.clearActive()
      }
    },
    stopGame: function (){
      this.countUserInput = 0
      this.round = 0
      this.textInfo = ""
      this.clearActive()
    },
    startGame: function (){
      this.round = 1
      this.textInfo = ""
      this.setLevelTime()

      this.startRound()
    },

    startStop: function (){

      if (!this.isPlaying) {
        this.startGame()
        this.buttonText = this.textStop
      }
      else {
        this.stopGame()
        this.buttonText = this.textStart
      }

      this.isPlaying = !this.isPlaying
    }

  },
  components: {

  }
}
</script>

<style>
#app{
  display: grid;
  grid-template-columns: repeat(4, 2fr);
}
.game-field{
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-column: 2/4;
}
.game-field span{
  height: 100px;
}
.game-field span:hover{
  cursor: pointer;
}
.game-field span:active{
  outline: 2px solid black;
  outline-offset: -2px;
}
.round, .info{
  grid-column: 2/4;
}
.info{
  text-align: center;
}
button.round{
  margin: 20px 0;
  padding: 10px;
  font-weight: bold;
}
.set-level label {
  display: block;
}

.game-field span:hover{
  outline-offset: -9px;
}
.blue { background-color: rgba(0, 0, 255, .4); }
.active-blue { background-color: blue}
.blue:hover{ outline: 9px solid blue; }

.red  { background-color: rgba(255, 0, 0, .4); }
.active-red {background-color: red}
.red:hover{ outline: 9px solid red; }

.yellow { background-color: rgba(255, 255, 0, .4); }
.active-yellow {background-color: yellow}
.yellow:hover{ outline: 9px solid yellow; }

.green { background-color: rgba(0, 128, 0, .4); }
.active-green {background-color: green}
.green:hover{ outline: 9px solid green; }

</style>
