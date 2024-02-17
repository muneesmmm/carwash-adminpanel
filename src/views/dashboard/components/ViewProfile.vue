<template>
  <v-row justify="center">
    <v-dialog v-model="internalDialog" @click:outside="cancelCustomer" max-width="600px">
      <v-card>
        <v-card-title class="font-weight-bold text-h3"> Customer Details</v-card-title>
        <v-card-text>
          <!-- <v-text-field
            v-if="planName"
            v-model="planName"
            label="Package"
          ></v-text-field> -->
          <v-card class="d-flex px-3 py-3">
            <span class="font-weight-bold">Package :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ planName?planName : 'No Plans' }}</span>
          </v-card>
          <v-card v-if="duration" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Duration :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ duration }}</span>
          </v-card>
          <v-card v-if="remainingInteriors" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Remaining Interios :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ remainingInteriors }}</span>
          </v-card>
          <v-card v-if="remainingWashes" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Remaining Washes :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ remainingWashes }}</span>
          </v-card>
          <v-card class="d-flex px-3 py-3">
            <span class="font-weight-bold">Phone :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ userData.phone }}</span>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="cancelCustomer">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: Boolean,
    selectedUser: Object,
  },
  data() {
    return {
      planName: "",
      duration: null,
      remainingWashes: "",
      remainingInteriors: "",
      internalDialog: this.dialog,
      userData:this.selectedUser
    };
  },
  watch: {
    dialog: {
      handler(){
        // Update internalDialog state based on changes to the dialog prop
      this.internalDialog = this.dialog;
      }
    },
    selectedUser: {
      handler(){
        // Update internalDialog state based on changes to the dialog prop
      this.userData = this.selectedUser;
      }
    },
  },
  methods: {
    updateUserData() {
      // Update component state based on the new value of selectedUser
      if (this.selectedUser) {
        this.planName = this.selectedUser.selectedPackage?.plan?.name || "";
        this.duration = this.selectedUser.selectedPackage?.plan?.duration
          ? this.selectedUser.selectedPackage.plan.duration + " Days"
          : null;
        this.remainingWashes =
          this.selectedUser.selectedPackage?.remainingWashes || "";
        this.remainingInteriors =
          this.selectedUser.selectedPackage?.remainingInteriors || "";
      } else {
        // Reset component state if selectedUser is null or undefined
        this.planName = "";
        this.duration = null;
        this.remainingWashes = "";
        this.remainingInteriors = "";
      }
    },
    cancelCustomer() {
      // Emit an event to notify the parent component about the cancel action
      this.$emit("cancel");
    },
  },
  mounted() {
    // Call the method to initialize user data when the component is mounted
    this.updateUserData();
  },
};
</script>
