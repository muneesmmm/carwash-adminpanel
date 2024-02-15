<template>
  <v-container id="wash" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Wash"
      class="px-5 py-3"
    >
      <v-data-table :headers="headers" :items="washHustory">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "WashDashboard",

  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Vehicle", value: "vehicle.vehicleNumber" },
        { text: "Customer Name", value: "vehicle.owner.name" },
        { text: "Phone", value: "vehicle.owner.phone" },
        { text: "Staff Name", value: "staff.name" },
        { text: "Time", value: "formattedTime" },
      ],
      washHustory: [],
    };
  },
  methods: {
    async totalWashes() {
      try {
  const response = await axios.post("/get-washes", {
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.status) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  this.washHustory = response.data.data;
  console.log(this.washHustory);
} catch (error) {
  console.error("Error fetching user data:", error);
} finally {
  // Code to be executed after the request, if needed
}
    }
  },
  mounted() {
    this.totalWashes();
  },
};
</script>
<style>
   .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 1rem;
    height: 48px;
font-weight: 800;
}
</style>
