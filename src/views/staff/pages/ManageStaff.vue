<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row justify="end">
      <v-btn color="success" @click="openAddCustomerDialog">Add Staff</v-btn>
    </v-row>
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Users"
      class="px-5 py-3"
    >
      <v-data-table :headers="headers" :items="userData">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.role`]="{ item }">
          <v-chip color="success">{{ item.role }}</v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn small color="success" @click="viewDetails(item._id)"><v-icon class="mr-2">mdi-eye-outline</v-icon> View</v-btn
          >&nbsp;&nbsp;
          <v-btn small color="red" @click="deleteUserData(item._id)"><v-icon class="mr-2">mdi-delete-outline</v-icon>Delete</v-btn>
        </template>
      </v-data-table>
    </base-material-card>
    <create-user-dialog
      :dialog="addCustomerDialog"
      @save="saveCustomer"
      @cancel="cancelAddCustomer"
    ></create-user-dialog>
  </v-container>
</template>

<script>
import CreateUserDialog from "../components/CreateUserDialog.vue";
import axios from "axios";

export default {
  components: { CreateUserDialog },
  name: "DashboardDashboard",

  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Role", value: "role" },
        { text: "Action", value: "action" },
      ],
      userData: [],
      addCustomerDialog: false,
    };
  },
  methods: {
    totalVehicles(item) {
      return item.length;
    },
    viewDetails(id) {
      this.$router.push({ name: "StaffProfile", params: { id } });
    },
    async fetchData() {
      try {
        const response = await axios.post("/get-users", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.status) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        this.userData = response.data.user;
        console.log(this.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    openAddCustomerDialog() {
      this.addCustomerDialog = true;
    },
    async saveCustomer(newCustomer) {
      try {
        const response = await axios.post("/register", newCustomer);

        if (!response.status) {
          throw new Error(`Failed to register user: ${response.statusText}`);
        }

        // Assuming the API response contains the registered user data
        const registeredUser = response.data;

        // Add the registered user to the data table
        this.userData.push({
          _id: registeredUser.id, // Change this based on the actual response structure
          name: registeredUser.name,
          email: registeredUser.email,
          phone: registeredUser.phone,
        });

        // Reset form and close dialog
        this.fetchData();
        this.addCustomerDialog = false;
      } catch (error) {
        console.error("Error registering user:", error);
      }
    },
    cancelAddCustomer() {
      this.addCustomerDialog = false;
    },
    async deleteUserData(item) {
      try {
        const id = item;
        const response = await axios.post(
          "/delete-user",
          { id },
          {
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
          }
        );

        if (!response.data) {
          throw new Error("Failed to fetch user data");
        } else {
          this.fetchData();
          return true;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
