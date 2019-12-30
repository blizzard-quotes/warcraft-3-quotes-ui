<template>
  <v-container id="quiz">
    <h2 id="quiz-header">Quiz</h2>
    <p class="text-justify">
      Familiar with all of the Warcraft III quotes? See how high you can score.
      Quotes and potential answers are randomly selected.
    </p>
    <v-checkbox
      id="quiz-is-melee-checkbox"
      :color="color"
      v-model="isMelee"
      label="Only melee units"
      class="my-0"
      @change="getEveryUnit()"
    ></v-checkbox>
    <v-card flat>
      <v-row dense class="pa-2">
        <v-col cols="12">
          <p class="text-justify font-weight-bold my-0">"{{ quote.value }}"</p>
        </v-col>
        <v-col cols="12">
          <p class="text-justify my-0">{{ feedback }}</p>
        </v-col>
        <v-col cols="12">
          <p class="text-justify font-weight-bold my-0">Score: {{ score }}</p>
        </v-col>
      </v-row>
      <v-row dense align="center" justify="center" class="pa-2">
        <v-col cols="12" sm="6" md="3" v-for="(choice, i) in choices" :key="i">
          <v-btn
            class="quiz-button-choice"
            block
            :disabled="gameOver"
            @click="answer(choice)"
          >{{ choice }}</v-btn>
        </v-col>
        <v-col>
          <v-btn id="quiz-button-restart" block @click="restart">Restart</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Quiz",

  data: () => ({
    quote: "You're the king? Well, I didn't vote for you.",
    choices: ["Archer", "Far Seer", "Crypt Fiend", "Peasant"],
    units: [],
    isMelee: true,
    gameOver: false,
    feedback: "Select the unit which said the above quote.",
    score: 0,
    color: "#F4D03F"
  }),
  created() {
    this.getEveryUnit();
  },
  methods: {
    getEveryUnit() {
      let url = "https://api.wc3.blizzardquotes.com/v1/units";

      if (this.isMelee) {
        url += "?is_melee=true";
      }

      axios
        .get(url)
        .then(res => {
          this.units = res.data;
          this.randomQuote();
        })
        .catch(err => console.log(err));

      this.default();
    },
    randomQuote() {
      let url = "https://api.wc3.blizzardquotes.com/v1/quotes/random";

      if (this.isMelee) {
        url += "?is_melee=true";
      }

      axios
        .get(url)
        .then(res => {
          this.quote = res.data;
          this.randomChoices();
        })
        .catch(err => console.log(err));
    },
    randomChoices() {
      this.choices = [];
      this.choices.push(this.quote.unit);

      let randomNumber = 0;
      do {
        randomNumber = this.randomNumber(0, this.units.length - 1);

        if (!this.choices.includes(this.units[randomNumber])) {
          this.choices.push(this.units[randomNumber]);
        }
      } while (this.choices.length < 4);

      this.shuffle(this.choices);
    },
    answer(choice) {
      if (choice === this.quote.unit) {
        this.feedback = "Correct!";
        this.score++;
        this.randomQuote();
      } else {
        this.feedback = `Incorrect! ${this.quote.unit} was the correct answer.`;
        this.gameOver = true;
      }
    },
    restart() {
      this.randomQuote();
      this.default();
    },
    default() {
      this.feedback = "Select the unit which said the above quote.";
      this.score = 0;
      this.gameOver = false;
    },
    randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }
};
</script>
