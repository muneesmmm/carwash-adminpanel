<template>
  <v-container id="plans" fluid tag="section">
    <base-material-card icon="mdi-clipboard-text" title="Manage Customers">
      <v-data-table :headers="headers" :items="plans">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn color="primary" small @click="editPlan(item)"
            >Edit</v-btn
          >
        </template>
        <template v-slot:[`item.duration`]="{ item }">
          <span v-if="item.duration">{{ item?.duration }} Days</span>
        </template>
      </v-data-table>
    </base-material-card>
    <view-plan
      v-if="selectedPlan"
      :dialog="customerDialog"
      :selectedPlan="selectedPlan"
      @cancel="closeDialog"
      @save="updatePlan"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import ViewPlan from '../components/ViewPlan.vue';

export default {
  components: { ViewPlan },

  name: "PlanView",

  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Name", value: "name" },
        { text: "Number of Vehicles", value: "numberOfCars" },
        { text: "Washes", value: "totalWashes" },
        { text: "Interior", value: "totalInteriors" },
        { text: "Price", value: "price" },
        { text: "duration", value: "duration" },
        { text: "Action", value: "action" },
      ],
      plans: [],
      customerDialog: false,
      selectedPlan: {},
      search: "",
    };
  },
  methods: {
    editPlan(item) {
      this.selectedPlan = item;
      this.customerDialog = true;
    },
    closeDialog() {
      this.customerDialog = false;
    },
    async fetchData() {
      try {
        const response = await axios.post(
          "/get-plans",
          {
            headers: {
              "Content-Type": "application/json",
              // Add any other headers if needed
            },
          }
        );
        
        // Ensure the request was successful (status code 2xx)
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        this.plans = await response.data.data;
        // Parse the JSON response
        
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    async updatePlan(data) {
      console.log();
      try {
        const response = await axios.post("/update-plans", data);

        
        // Ensure the request was successful (status code 2xx)
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        if(response.data.updatedPlan){
          this.fetchData();
          this.closeDialog()
        }
        // Parse the JSON response
        
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 1rem;
  height: 48px;
  font-weight: 800;
}
</style>
