<template>
  <div class="default-container">
    <div style="margin-bottom:15px">
      Search results for "{{ $route.query.t }}"
      {{ $route.query.ln ? " in " + $route.query.ln : "" }}
    </div>
    <div class="f-row">
      <div class="left-column" :style="leftStyle">
        <button
          @click="showJobDetails(job)"
          v-for="job in searchResults"
          :key="job.JobId"
          class="company-box"
        >
          <h3>{{ job.JobTitle }}</h3>
          <div style="color:#555">
            <div class="f-row">
              <div>
                <img
                  style="width:24px"
                  :src="
                    `https://avatars.dicebear.com/4.5/api/${
                      ['jdenticon', 'bottts', 'gridy'][job.EmployerId % 3]
                    }/${job.EmployerName}.svg`
                  "
                />
              </div>
              <div style="margin-left:10px;align-self:center">
                <b>{{ job.EmployerName }}</b>
                <div>{{ job.JobSummary }}</div>
              </div>
            </div>
            <div style="font-size:0.7rem;color:#888;margin-top:18px">
              {{ formatDate(job.CreatedDateTime) }}
            </div>
          </div>
        </button>
      </div>
      <div class="right-column" :style="rightStyle">
        <div style="position:absolute; right:20px">
          <button class="b-close" @click="closeJobDetails()">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <job-details :jobid="selectedJob.JobId"></job-details>
      </div>
    </div>
  </div>
</template>

<script>
import FetchMethods from "../lib/FetchMethods";
import * as DF from "date-fns";

import JobDetails from "./JobDetails.vue";

export default {
  data() {
    return {
      searchResults: [],
      detailsOpen: false,
      selectedJob: {},
    };
  },

  components: {
    JobDetails,
  },

  mounted() {
    this.searchJobs();
  },

  computed: {
    rightStyle() {
      return {
        width: this.detailsOpen ? "60%" : 0,
        overflow: this.detailsOpen ? "auto" : "hidden",
        padding: this.detailsOpen ? "20px" : 0,
      };
    },
    leftStyle() {
      return { width: this.detailsOpen ? "40%" : "100%" };
    },
  },

  methods: {
    formatDate(dt) {
      return DF.format(new Date(dt), "dd MMM yyyy");
    },

    closeJobDetails() {
      this.detailsOpen = false;
      this.selectedJob = {};
    },

    showJobDetails(job) {
      console.log(job);
      this.detailsOpen = true;
      this.selectedJob = job;
    },

    searchJobs() {
      FetchMethods.get(
        "search?t=" +
          this.$route.query.t +
          "&lt=" +
          this.$route.query.lt +
          "&lid=" +
          this.$route.query.lid,
        (res) => {
          console.log(res);
          this.searchResults = res.data;
        },
        (failure) => {
          console.error(failure);
        },
        (error) => {
          console.error(error);
        }
      );
    },
  },
};
</script>

<style scoped>
button.company-box {
  font-family: "Heebo", "Segoe UI", Avenir, Helvetica, Arial, sans-serif;
  display: block;
  border: 0;
  cursor: pointer;
  padding: 20px;
  width: 100%;
  text-align: left;
  outline: none;
}

.right-column {
  background: #fff;
  /* transition: all 0.15s linear; */
  box-shadow: 1px 1px 5px 0px #3333;
  margin-left: 20px;
  position: relative;
}

.b-close {
  border: 0;
  background: #fff;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
}

.b-close:hover {
  background: #eee;
}
</style>
