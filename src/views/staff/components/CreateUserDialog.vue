<template>
  <v-row justify="center">
    <v-dialog
      v-model="internalDialog"
      @click:outside="cancelCustomer"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h3"> Add New Customer </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newCustomer.staffId"
              label="Staff Id"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.username"
              label="Username"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.name"
              label="Name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.email"
              label="Email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.phone"
              label="Phone"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.location"
              label="Staff Site"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.password"
              label="Password"
              type="password"
              :rules="[rules.required]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click="saveCustomer" :disabled="!valid"
            >Register</v-btn
          >
          <v-btn class="error" @click="cancelCustomer">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Field is required.',
        email: value => /.+@.+\..+/.test(value) || 'Email must be valid.'
      },
      internalDialog: this.dialog,
      newCustomer: {
        username: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        location: "",
        staffId: "",
        role: "staff",
      },
    };
  },
  watch: {
    dialog(newValue) {
      // Update internalDialog state based on changes to the dialog prop
      this.internalDialog = newValue;
    },
  },
  methods: {
    saveCustomer() {
      if (this.$refs.form.validate()) {
        this.$emit("save", this.newCustomer);
        this.$refs.form.reset();
      }
    },
    cancelCustomer() {
      this.$refs.form.reset();
      this.$emit("cancel");
    },
  },
};
</script>
