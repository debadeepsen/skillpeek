<template>
  <div :class="!jobid ? 'default-container' : ''">
    <h1>{{ job.JobTitle }}</h1>
    <div style="font-size:1.5rem;margin-bottom:8px">
      <!-- <i class="fas fa-building"></i> -->
      <div style="display:flex;flex-direction:row">
        <div>
          <img
            style="width:48px"
            :src="
              `https://avatars.dicebear.com/4.5/api/${
                ['jdenticon', 'bottts', 'gridy'][job.EmployerId % 3]
              }/${job.EmployerName}.svg`
            "
          />
        </div>
        <div style="margin-left:10px">
          <b>{{ job.EmployerName }}</b>
        </div>
      </div>
    </div>
    <div>
      <i class="fas fa-home"></i>{{ job.CityName }}, {{ job.StateName }}
    </div>
    <div><i class="fas fa-envelope"></i>{{ job.Email }}</div>
    <div><i class="fas fa-phone-square-alt"></i>{{ job.Phone }}</div>
    <br />
    <div v-html="job.JobDescription"></div>
    <div style="margin:10px 0px 30px 0px" v-html="job.Description"></div>
  </div>
</template>

<script>
import FetchMethods from "../lib/FetchMethods";

export default {
  props: {
    jobid: Number,
  },

  data() {
    return {
      job: {},
    };
  },

  watch: {
    jobid() {
      this.fetchJobDetails(this.jobid);
    },
  },

  mounted() {
    if (this.$route.params.id) {
      this.fetchJobDetails(this.$route.params.id);
    }

    if (this.props && this.props.jobdetails) {
      this.job = this.props.jobdetails;
    }
  },

  methods: {
    fetchJobDetails(jobId) {
      FetchMethods.get(
        "job/" + jobId,
        (res) => {
          this.job = res.data;
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
.job-box {
  box-shadow: 1px 1px 3px #1123;
}
</style>
