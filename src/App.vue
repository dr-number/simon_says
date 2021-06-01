<template>
  <div id="app">
    <div class="game-field">
      <span :class="'blue ' + blueActive" v-on:click="isInputData(1)"></span>
      <span :class="'red ' + redActive" v-on:click="isInputData(2)"></span>
      <span :class="'yellow ' + yellowActive" v-on:click="isInputData(3)"></span>
      <span :class="'green ' + greenActive" v-on:click="isInputData(4)"></span>
    </div>
    <div v-if="this.round === 0" class="set-level">
      <label for="easy">
        <input name="level" id="easy" value="easy" type="radio" v-model="difficulty"> Легко
      </label>
      <label for="middle">
        <input name="level" id="middle" value="middle" type="radio" v-model="difficulty" > Средне
      </label>
      <label for="hard">
        <input name="level" id="hard" value="hard" type="radio" v-model="difficulty"> Сложно
      </label>
    </div>
    <button class="round" v-on:click="startStop">{{ buttonText }}</button>
    <b class="round">Уровень: {{ infoDifficulty }} Раунд: {{ round }} из {{this.roundFinish}}</b>
    <p class="round">Колличество отгаданных чисел раунда: {{countUserInput}} из {{ round }}</p>
    <b :class="'info ' + statusInfo">{{ infoText }}</b>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      difficulty: "easy",
      roundFinish: 20,

      round: 0,

      textStart: "Старт!",
      buttonText: "Старт!",
      textStop: "Стоп!",
      infoText: "",

      levelTime: 1.5,
      isPlaying: false,

      soundBlue: new Audio(require('@/assets/sound1.mp3')),
      soundRed: new Audio(require('@/assets/sound2.mp3')),
      soundYellow: new Audio(require('@/assets/sound3.mp3')),
      soundGreen: new Audio(require('@/assets/sound4.mp3')),
      colors: ["blue", "red", "yellow", "green"],

      isActiveBlue: false,
      isActiveRed: false,
      isActiveYellow: false,
      isActiveGreen: false,
      randArray: [],
      countUserInput: 0,

      infoDifficulty: "",
      isShowingColors: true
    }
  },

  computed: {
    blueActive: function (){
      if (this.isActiveBlue){
        this.soundBlue.play()
        return 'active-blue';
      }
      return ''
    },
    redActive: function (){
      if (this.isActiveRed){
        this.soundRed.play()
        return 'active-red'
      }
      return ''
    },
    yellowActive: function (){
      if (this.isActiveYellow){
        this.soundYellow.play()
        return 'active-yellow'
      }
      return ''
    },
    greenActive: function (){
      if (this.isActiveGreen){
        this.soundGreen.play()
        return 'active-green'
      }
      return ''
    },
    statusInfo: function (){
      if(this.isWinGame() || !this.isShowingColors) return 'success'
      return 'error'
    }
  },

  methods: {
    sleep: function (ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    playMusic: function (value){
      switch (value) {
        case 1: this.soundBlue.play(); break;
        case 2: this.soundRed.play(); break;
        case 3: this.soundYellow.play(); break;
        case 4: this.soundGreen.play(); break;
      }
    },
    isInputData: function (value){

      //Если игра не начата или компьютер показывает цвета, то ввод пользователя блокируется
      if(this.isShowingColors)
        return

      if(this.round === 0){
        this.infoText = "Для начала игры нажмите Старт!"
        return
      }

      this.playMusic(value)

      if(this.randArray[this.countUserInput] === value) {
        this.countUserInput += 1
        this.sleep(this.levelTime);
        this.clearActive();
      }
      else {
        this.startStop()
        this.infoText = "Раунд не пройден!"
      }

      if(this.isRoundComplete()) {
        if(this.isWinGame()){
          this.infoText = "Победа!!!!"
          alert(this.infoText)
          this.startStop()
        }
        else {
          this.randArray = []
          this.countUserInput = 0
          this.round += 1
          this.clearActive()
          this.startRound()
        }
      }
    },
    isWinGame: function (){
      return this.round === this.roundFinish
    },
    isRoundComplete: function (){
      return this.randArray.length === this.countUserInput
    },
    setLevelTime: function (){
      if(this.difficulty === "easy") this.levelTime = 1500
      if(this.difficulty === "middle") this.levelTime = 1000
      if(this.difficulty === "hard") this.levelTime = 400
    },
    setLevelInfo: function (){
      if(this.difficulty === "easy") this.infoDifficulty = "лёгкий"
      if(this.difficulty === "middle") this.infoDifficulty = "средний"
      if(this.difficulty === "hard") this.infoDifficulty = "сложный"
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
      this.isShowingColors = true
      this.infoText = "Компьютер показывает цвета. Подождите..."
      this.generateRandArray()

      for(let i = 0; i < this.round; ++i) {
        let index = this.randArray[i]

        await this.sleep(this.levelTime / 2);

        switch (index) {
          case 1: this.isActiveBlue = true; break;
          case 2: this.isActiveRed = true; break;
          case 3: this.isActiveYellow = true; break;
          case 4: this.isActiveGreen = true; break;
        }

        await this.sleep(this.levelTime / 2);
        this.clearActive()
      }

      this.infoText = "Можно выбирать цвета!"
      this.isShowingColors = false
    },
    stopGame: function (){
      this.countUserInput = 0
      this.round = 0
      this.infoText = ""
      this.isShowingColors = true
      this.clearActive()
    },
    startGame: function (){
      this.round = 1
      this.infoText = ""
      this.setLevelTime()
      this.setLevelInfo()

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
}
</script>

<style  scoped src="@/assets/styles.css">
</style>
