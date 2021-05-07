<template>
  <div>
    <div
      class="banner"
      :style="{
        backgroundImage: `linear-gradient(0deg,#0007,#0007), url(${bg})`,
      }"
    >
      <div class="center">
        <div class="container">
          <div class="headline">
            Your career awaits you.
          </div>
          <div class="subheading">
            Start your job search on SkillPeek.
          </div>
          <div style="margin-top:20px">
            <form @submit.prevent="searchJobs" style="position:relative">
              <input
                type="text"
                v-model="search.title"
                placeholder="Keywords"
              />
              <input
                type="text"
                v-model="search.location"
                placeholder="Location"
                @keyup="getSearchSuggestions()"
              />
              <button title="Search jobs">
                <i class="fa fa-search"></i>
              </button>
              <div class="suggestions">
                <a
                  v-for="(loc, l) in locationSuggestions"
                  :key="l"
                  @click="selectLocation(loc)"
                >
                  {{ loc.display }} ({{ loc.type
                  }}{{ loc.type == "City" ? " in" + loc.stateCode : "" }})
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="home-row">
      <div>
        <h3>
          <i class="las la-hand-pointer"></i>
          Convenient
        </h3>
        <div>
          Search for hundreds of jobs from the comfort of your home.
        </div>
      </div>
      <div>
        <h3>
          <i class="las la-check-double"></i>
          Updated
        </h3>
        <div>New jobs posted every day.</div>
      </div>
      <div>
        <h3>
          <i class="las la-link"></i>
          Networked
        </h3>
        <div>Get noticed by employers all across the country.</div>
      </div>
    </div>
    <div class="home-container">
      <h2>Top Employers</h2>
      <div class="employer-container">
        <router-link
          class="company-box"
          v-for="e in topEmployers"
          :key="e.EmployerId"
          :to="'/company/profile/' + e.EmployerId"
        >
          <div class="c-row">
            <div>
              <img
                style="width:40px"
                :src="
                  `https://avatars.dicebear.com/4.5/api/${
                    ['jdenticon', 'bottts', 'gridy'][e.EmployerId % 3]
                  }/${e.EmployerName}.svg`
                "
              />
            </div>
            <div>
              {{ e.EmployerName }}
              <div v-if="e.JobCount" class="job-bubble">
                {{ e.JobCount }} jobs
              </div>
            </div>
            <div></div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import FetchMethods from "../lib/FetchMethods";

export default {
  data() {
    return {
      bg: "",
      search: {
        title: "",
        location: "",
        selectedLocation: {},
      },
      topEmployers: [],
      locationSuggestions: [],
    };
  },

  mounted() {
    let images = [
      "pexels-andrew-neel-2312369",
      "pexels-luis-gomes-546819",
      "pexels-startup-stock-photos-7112",
      "pexels-thisisengineering-3861958",
      "pexels-vojtech-okenka-392018",
    ];

    let index = Math.floor(Math.random() * images.length);
    this.bg = images[index] + ".jpg";

    this.fetchTopEmployers();
  },

  methods: {
    fetchTopEmployers() {
      FetchMethods.get(
        `employers?limit=6`,
        (res) => {
          this.topEmployers = res.data;
        },
        (failure) => {
          console.error(failure);
        },
        (error) => {
          console.error(error);
        }
      );
    },

    searchJobs() {
      this.$router.push(
        "/search/results?t=" +
          this.search.title +
          "&ln=" +
          this.search.location +
          "&lt=" +
          this.search.selectedLocation.type +
          "&lid=" +
          this.search.selectedLocation.id
      );
    },

    getSearchSuggestions() {
      let loc = this.search.location;
      if (!loc.trim()) {
        this.locationSuggestions = [];
        return;
      }
      FetchMethods.get(
        "location/suggestions/" + loc,
        (res) => {
          this.locationSuggestions = [];
          res.data.cities.forEach((c) => {
            this.locationSuggestions.push({
              type: "City",
              id: c.CityId,
              stateId: c.StateId,
              stateCode: c.StateCode,
              display: c.CityName,
            });
          });
          res.data.states.forEach((s) => {
            this.locationSuggestions.push({
              type: "State",
              id: s.StateId,
              display: s.StateName,
            });
          });
        },
        (failure) => {
          console.error(failure);
        },
        (error) => {
          console.error(error);
        }
      );
    },

    selectLocation(loc) {
      this.search.location = loc.display;
      this.search.selectedLocation = loc;
      this.locationSuggestions = [];
    },
  },
};
</script>

<style scoped>
.banner {
  height: 70vh;
  width: 100vw;
  background-size: cover;
  background-position-y: center;
  margin-left: -40px;
  margin-top: -20px;
}

.banner > .center {
  width: 80vw;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.headline {
  font-family: "Roboto Slab";
  text-align: center;
  width: 100%;
  color: azure;
  font-weight: 800;
  font-size: 48px;
}

.subheading {
  width: fit-content;
  margin: 0 auto;
  color: #fff9;
}

form input {
  width: 250px;
  border: 0;
  outline: none;
  height: 36px;
  padding-left: 15px;
  font-family: "Oxygen", sans-serif;
  color: #222;
}

form input::placeholder {
  color: silver;
}

form input:focus {
  box-shadow: -1px -3px 4px 0px #0001 inset;
}

form input:nth-child(1) {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: 1px solid #ddd5;
}

form button {
  border: 0;
  height: 38px;
  width: 38px;
  background: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  outline: none;
  position: relative;
  top: -1px;
}

form button:hover {
  cursor: pointer;
  color: tomato;
}

.home-row {
  width: 60vw;
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.home-row > div {
  flex-grow: 1;
  background: #fff;
  border: 1px solid #ddd4;
  box-shadow: 2px 2px 8px 2px #1112;
  padding: 15px;
  margin: 10px;
  width: 100px;
  border-radius: 2px;
}

.home-row > div:nth-child(1) h3 {
  color: #d80909;
}

.home-row > div:nth-child(2) h3 {
  color: #08a750;
}

.home-row > div:nth-child(3) h3 {
  color: #0997c2;
}

.las {
  font-size: 32px;
}

.home-container {
  width: 60vw;
  margin: 0 auto;
  margin-top: 20px;
}

.home-container h2 {
  border-bottom: 1px solid salmon;
}

.employer-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.company-box {
  width: 28%;
  margin: 5px;
}

.suggestions {
  background-color: white;
  color: #222;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  box-shadow: 2px 2px 6px 2px #1113;
  right: 7%;
  width: 46%;
}

.suggestions > a {
  display: block;
  font-size: 0.8rem;
  padding: 6px;
  color: #777;
}

.suggestions > a:hover {
  color: #fff;
  background: #777;
  transition: all 0.15s;
}
</style>
