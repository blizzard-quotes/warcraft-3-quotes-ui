<template>
  <v-container fluid class="mx-0">
    <h1>Warcraft III Quotes</h1>
    <span class="font-weight-bold text-justify">"{{ quote.value }}"</span>
    <p class="font-italic text-justify">{{ flavorText }}</p>
    <p class="text-justify">
      A site created to easily access and remember memorable quotes from the
      famous real-time strategy game, Warcraft III. Even without voice clips,
      these quotes can invoke a sense of nostalgia. Includes unit quotes from
      Warcraft III and The Frozen Throne expansion pack. Does not include any
      cinematic quotes. For information regarding the API, see the Swagger UI.
    </p>
    <v-btn :color="color" small outlined @click="randomQuote()">Refresh</v-btn>
    <p class="text-justify mt-4">
      Click the button above or press the 'r' key to return another random
      quote.
    </p>

    <h2>Swagger UI</h2>
    <p class="text-justify">
      Interactive UI for making REST calls to the underlying API.
    </p>
    <p class="body-2">
      <a href="https://swagger.wc3.blizzardquotes.com/"
        >https://swagger.wc3.blizzardquotes.com/</a
      >
    </p>

    <h2>Usage</h2>
    <p class="text-justify">
      Some basic examples for using the underlying API. See the Swagger UI above
      for more details.
    </p>
    <p class="my-1 body-2" v-for="(example, i) in examples" :key="i">
      <a :href="example.link">{{ example.text }}</a>
    </p>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Information',

  data: () => ({
    quote: '',
    flavorText: '',
    color: '#F4D03F',
    examples: [
      {
        link: 'https://api.wc3.blizzardquotes.com/v1/quotes/random',
        text: 'https://api.wc3.blizzardquotes.com/v1/quotes/random'
      },
      {
        link:
          'https://api.wc3.blizzardquotes.com/v1/quotes/random?faction=human&action=pissed&is_hero=true&is_melee=true',
        text: 'A random pissed-off human hero quote'
      },
      {
        link: 'https://api.wc3.blizzardquotes.com/v1/quotes',
        text: 'https://api.wc3.blizzardquotes.com/v1/quotes'
      },
      {
        link:
          'https://api.wc3.blizzardquotes.com/v1/quotes?unit=knight&action=pissed',
        text: 'Only pissed-off knight quotes'
      }
    ],
    easterEggArray: []
  }),
  created() {
    this.randomQuote();
  },
  mounted() {
    window.addEventListener('keypress', e => {
      if (String.fromCharCode(e.keyCode) === 'r') {
        this.randomQuote();
      }
    });
    window.addEventListener('keydown', e => {
      this.easterEggArray.push(e.keyCode);

      if (this.easterEggArray.length > 11) {
        this.easterEggArray.shift();
      }

      if (
        this.easterEggArray.length === 11 &&
        this.easterEggArray.every(
          (value, index) =>
            value === [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13][index]
        )
      ) {
        console.log('Yahaha! You found me!');
      }
    });
  },
  methods: {
    randomQuote() {
      axios
        .get('https://api.wc3.blizzardquotes.com/v1/quotes/random')
        .then(res => {
          this.quote = res.data;
          this.randomFlavorText();
        })
        .catch(err => console.log(err));
    },
    randomFlavorText() {
      let randomNumber = this.randomNumber(0, 3);
      let text = '-';
      if (
        (this.quote.isHero && !this.quote.isMelee) ||
        this.quote.unit === 'Shandris' ||
        this.quote.unit === 'Naisha'
      ) {
        switch (randomNumber) {
          default:
            text = `-${this.pissedConditional()}${this.quote.unit}`;
        }
        text += '';
      } else if (this.quote.isHero) {
        switch (randomNumber) {
          case 0:
            text = `-A friendly${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 1:
            text = `-An honored${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 2:
            text = `-An exalted${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 3:
          default:
            text = `-A revered${this.pissedConditional()}${this.quote.unit}`;
        }
      } else {
        switch (randomNumber) {
          case 0:
            text = `-Some random${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 1:
            text = `-An ordinary${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 2:
            text = `-Your typical${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 3:
          default:
            text = `-A forgotten${this.pissedConditional()} ${this.quote.unit}`;
        }
      }

      this.flavorText = text;
    },
    randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pissedConditional() {
      if (
        (this.quote.isHero && !this.quote.isMelee) ||
        this.quote.unit === 'Shandris' ||
        this.quote.unit === 'Naisha'
      ) {
        return this.quote.action.toLowerCase() === 'pissed'
          ? 'A pissed-off '
          : '';
      } else {
        return this.quote.action.toLowerCase() === 'pissed'
          ? ', pissed-off '
          : ' ';
      }
    }
  }
};
</script>
