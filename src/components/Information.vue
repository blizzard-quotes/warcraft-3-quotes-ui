<template>
  <v-container id="information">
    <h1 id="information-header">Warcraft III Quotes</h1>
    <p class="font-weight-bold text-justify my-0">"{{ quote.value }}"</p>
    <p class="font-italic text-justify">{{ flavorText }}</p>
    <p class="text-justify">
      {{ url }} was created to easily access and remember memorable quotes from
      the famous real-time strategy game, Warcraft III. Includes unit quotes
      from Warcraft III and The Frozen Throne expansion pack. Does not include
      any cutscene or cinematic quotes. For information regarding the API, see
      the Swagger UI.
    </p>
    <v-btn
      id="refresh-button"
      :color="color"
      small
      outlined
      @click="randomQuote()"
      >Refresh</v-btn
    >
    <p class="text-justify mt-4">
      Click the button above or press the 'r' key to return another random
      quote.
    </p>

    <h2 id="information-swagger">Swagger UI</h2>
    <p class="text-justify">
      Interactive UI for making REST calls to the underlying API.
    </p>
    <p class="body-2">
      <a :href="swaggerUrl">{{ swaggerUrl }}</a>
    </p>

    <h2 id="information-usage">Usage</h2>
    <p class="text-justify">
      Some basic examples for using the underlying API. See the Swagger UI above
      for more methods. query parameters, and additional details.
    </p>
    <h3 id="information-usage-random">Random Quotes</h3>
    <p
      style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
      class="my-1 body-2"
      v-for="(example, i) in examplesRandom"
      :key="'random,' + i"
    >
      <a :href="example">{{ example }}</a>
    </p>
    <h3 id="information-usage-collection" class="mt-4">Quotes</h3>
    <p
      style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
      class="my-1 body-2"
      v-for="(example, i) in examplesCollection"
      :key="'collection,' + i"
    >
      <a :href="example">{{ example }}</a>
    </p>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Information',

  data: () => ({
    url: process.env.VUE_APP_URL,
    swaggerUrl: process.env.VUE_APP_SWAGGER_URL,
    quote: 'The restless dead await.',
    flavorText: '-An ordinary Necromancer',
    color: process.env.VUE_APP_COLOR,
    loading: false,
    examplesRandom: [
      `${process.env.VUE_APP_API_URL}/v1/quotes/random`,
      `${process.env.VUE_APP_API_URL}/v1/quotes/random?faction=human&action=pissed&is_hero=true&is_melee=true`
    ],
    examplesCollection: [
      `${process.env.VUE_APP_API_URL}/v1/quotes`,
      `${process.env.VUE_APP_API_URL}/v1/quotes?unit=knight&action=pissed`
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

      console.log(this.easterEggArray);

      if (
        this.easterEggArray.length === 12 &&
        this.easterEggArray.every(
          (value, index) =>
            value === [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 16, 13][index]
        )
      ) {
        console.log('Yahaha! You found me!');

        this.easterEggArray.shift();
        return;
      }

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
      if (this.loading) {
        return;
      }
      this.loading = true;
      axios
        .get(`${process.env.VUE_APP_API_URL}/v1/quotes/random`)
        .then(res => {
          this.quote = res.data;
          this.randomFlavorText();
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    randomFlavorText() {
      let randomNumber = this.randomNumber(0, 4);
      let text = '-';
      if (this.isUniquePerson()) {
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
            text = `-A revered${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 3:
            text = `-An exalted${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 4:
          default:
            text = `-A distinguished${this.pissedConditional()}${
              this.quote.unit
            }`;
        }
      } else {
        switch (randomNumber) {
          case 0:
            text = `-A measly${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 1:
            text = `-Some random${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 2:
            text = `-An ordinary${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 3:
            text = `-Your typical${this.pissedConditional()}${this.quote.unit}`;
            break;
          case 4:
          default:
            text = `-A forgotten${this.pissedConditional()}${this.quote.unit}`;
        }
      }

      this.flavorText = text;
    },
    randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pissedConditional() {
      if (this.quote.action.toLowerCase() !== 'pissed') {
        if (this.isUniquePerson()) {
          return '';
        } else {
          return ' ';
        }
      }

      let randomNumber = this.randomNumber(0, 4);
      let text = '';

      if (this.isUniquePerson()) {
        switch (randomNumber) {
          case 0:
            text = 'A pissed-off ';
            break;
          case 1:
            text = 'An irritated ';
            break;
          case 2:
            text = 'A ticked-off ';
            break;
          case 3:
            text = 'An annoyed ';
            break;
          case 4:
          default:
            text = 'A provoked ';
        }

        return text;
      } else {
        switch (randomNumber) {
          case 0:
            text = ', pissed-off ';
            break;
          case 1:
            text = ', irritated ';
            break;
          case 2:
            text = ', ticked-off ';
            break;
          case 3:
            text = ', annoyed ';
            break;
          case 4:
          default:
            text = ', provoked ';
        }

        return text;
      }
    },
    isUniquePerson() {
      if (
        (this.quote.isHero && !this.quote.isMelee) ||
        this.quote.unit === 'Shandris' ||
        this.quote.unit === 'Naisha'
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
