<template>
  <div class="companies-view">
    <router-link
      class="company-box"
      v-for="e in employers"
      :key="e.EmployerId"
      :to="'/company/profile/' + e.EmployerId"
    >
      <div class="c-row">
        <div>
          <img
            style="width:60px"
            :src="
              `https://avatars.dicebear.com/4.5/api/${
                ['jdenticon', 'bottts', 'gridy'][e.EmployerId % 3]
              }/${e.EmployerName}.svg`
            "
          />
        </div>
        <div>
          <h4>{{ e.EmployerName }}</h4>
          <div class="dts">{{ e.Address }}, {{ e.CityName }}, {{ e.StateCode }}</div>
        </div>
        <div>
          <div v-if="e.JobCount" class="job-bubble">
            {{ e.JobCount }} jobs
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import FetchMethods from "../lib/FetchMethods";
// import * as IconGen from "https://cdn.jsdelivr.net/npm/jdenticon@3.1.0/dist/jdenticon.min.js";

export default {
  data() {
    return {
      employers: [],
    };
  },

  mounted() {
    FetchMethods.get(
      "employers",
      (res) => {
        this.employers = res.data;
      },
      (failure) => {
        console.error(failure);
      },
      (error) => {
        console.error(error);
      }
    );
  },
};
</script>

<style scoped>
.companies-view {
  width: 80vw;
  margin: 0 auto;
}

.dts {
  color: var(--dark-grey);
}
</style>
