<template>
  <v-row justify="center">
    <v-dialog v-model="internalDialog" max-width="600px">
      <v-card>
        <v-card-title> Add New Customer </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="newCustomer.username" label="Username"></v-text-field>
            <v-text-field v-model="newCustomer.name" label="Name"></v-text-field>
            <v-text-field v-model="newCustomer.email" label="Email"></v-text-field>
            <v-text-field v-model="newCustomer.phone" label="Phone"></v-text-field>
            <v-text-field v-model="newCustomer.password" label="Password" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveCustomer" :disabled="!valid">Register</v-btn>
          <v-btn @click="cancelCustomer">Cancel</v-btn>
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
    };
  },
  watch: {
    selectedUser: {
      handler(newVal) {
        // Update component state based on the new value of selectedUser
        this.updateState(newVal);
      },
      immediate: true, // Trigger the handler immediately when the component is created
      deep: true // Watch deeply for changes in selectedUser
    },
    dialog(newValue) {
      // Update internalDialog state based on changes to the dialog prop
      this.internalDialog = newValue;
    },
  },
  methods: {
    updateState(newVal) {
      if (newVal) {
        this.planName = newVal.selectedPackage?.plan?.name || "";
        this.duration = newVal.selectedPackage?.plan?.duration ? newVal.selectedPackage.plan.duration + " Days" : null;
        this.remainingWashes = newVal.selectedPackage?.remainingWashes || "";
        this.remainingInteriors = newVal.selectedPackage?.remainingInteriors || "";
      } else {
        // Reset component state if selectedUser is null or undefined
        this.planName = "";
        this.duration = null;
        this.remainingWashes = "";
        this.remainingInteriors = "";
      }
    },
    // Emit event to notify parent component of cancel action
    cancelCustomer() {
      this.$emit("cancel");
    },
  },
};
</script>