<template>
  <v-container id="quiz" class="pt-0">
    <h2 id="quiz-header">Quiz</h2>
    <p class="text-justify">
      Familiar with all of the Warcraft III quotes? See how high you can score.
      Quotes and potential answers are randomly selected.
    </p>
    <v-checkbox
      id="quiz-is-melee-checkbox"
      :disabled="loading"
      :color="color"
      v-model="isMelee"
      label="Only melee units"
      hint="Include only melee units (versus units). Does not include units that only 
      appear via the campaign or custom games."
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
            >{{ choice }}</v-btn
          >
        </v-col>
        <v-col>
          <v-btn color="#171717" id="quiz-button-restart" block @click="restart"
            >Restart</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import Konami from 'konami';

const CHOICES_LENGTH_DEFAULT = 4;
const CHOICES_LENGTH_KONAMI = 8;

export default {
  name: 'Quiz',

  data: () => ({
    quote: "You're the king? Well, I didn't vote for you.",
    choices: ['Archer', 'Far Seer', 'Crypt Fiend', 'Peasant'],
    choices_length: CHOICES_LENGTH_DEFAULT,
    units: [],
    isMelee: true,
    gameOver: false,
    feedback: 'Select the unit which said the above quote.',
    score: 0,
    color: process.env.VUE_APP_COLOR,
    loading: false,
  }),
  created() {
    this.getEveryUnit();
    new Konami(() => {
      this.choices_length = CHOICES_LENGTH_KONAMI;
      this.restart();
    });
  },
  methods: {
    getEveryUnit() {
      if (this.loading) {
        return;
      }

      let url = `${process.env.VUE_APP_API_URL}/v1/units`;

      if (this.isMelee) {
        url += '?is_melee=true';
      }

      this.loading = true;
      axios
        .get(url)
        .then((res) => {
          this.units = res.data;
          this.loading = false;
          this.randomQuote();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });

      this.default();
    },
    randomQuote() {
      if (this.loading) {
        return;
      }

      let url = `${process.env.VUE_APP_API_URL}/v1/quotes/random`;

      if (this.isMelee) {
        url += '?is_melee=true';
      }

      this.loading = true;
      axios
        .get(url)
        .then((res) => {
          this.quote = res.data;
          this.randomChoices();
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
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
        this.feedback = 'Correct!';
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
      this.feedback = 'Select the unit which said the above quote.';
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
    },
  },
};
</script>
