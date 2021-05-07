<template>
  <div class="default-container">
    <img
      style="width:120px"
      :src="
        `https://avatars.dicebear.com/4.5/api/${
          ['jdenticon', 'bottts', 'gridy'][company.EmployerId % 3]
        }/${company.EmployerName}.svg`
      "
    />
    <h1 style="margin-top:-5px">
      {{ company.EmployerName }}
    </h1>
    <div>
      <i class="fas fa-home"></i>{{ company.CityName }}, {{ company.StateName }}
    </div>
    <div style="margin-top:5px"><i class="fas fa-envelope"></i>{{ company.Email }}</div>
    <div style="margin-top:5px"><i class="fas fa-phone-square-alt"></i>{{ company.Phone }}</div>
    <br />
    <div>{{ company.Description }}</div>
    <h3>Open Jobs</h3>
    <ul>
      <li v-for="job in company.Jobs" :key="job.JobId">
        <router-link :to="'/job/' + job.JobId">{{ job.JobTitle }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import FetchMethods from "../lib/FetchMethods";

export default {
  data() {
    return {
      company: [],
    };
  },

  mounted() {
    FetchMethods.get(
      "employer/profile/" + this.$route.params.id,
      (res) => {
        this.company = res.data;
      },
      (failure) => {
        console.error(failure);
      },
      (error) => {
        console.error(error);
      }
    );

    // fetch("http://localhost:8800/employer/profile/" + this.$route.params.id)
    //   .then((r) => r.json())
    //   .then((d) => {
    //     this.company = d.data;
    //   });
  },
};
</script>

<style scoped>
.job-box {
  box-shadow: 1px 1px 3px #1123;
}
</style>
