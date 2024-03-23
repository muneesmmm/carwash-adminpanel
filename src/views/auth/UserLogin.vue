
<template>
  <v-app id="Login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <validation-observer @submit.prevent="login">
                  <v-form>
                    <validation-provider
                      name="username"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="username"
                        prepend-icon="mdi-account"
                        label="Login"
                        type="text"
                        :error-messages="errors"
                      ></v-text-field>
                    </validation-provider>
                    <validation-provider
                      name="password"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="password"
                        prepend-icon="mdi-lock"
                        label="Password"
                        type="password"
                        :error-messages="errors"
                      ></v-text-field>
                    </validation-provider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" type="submit">Login</v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card-text>

              <v-card-actions v-if="loginFailed">
                <v-alert dense type="error" icon="mdi-alert-circle-outline">
                  Invalid login credentials. Please try again.
                </v-alert>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      loginFailed: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/admin-login", {
          username: this.username,
          password: this.password,
        });

        const data = response.data;

        if (data.admin) {
          // Dispatch the 'login' action with user data
          this.$store.dispatch("login", data.admin);
          this.$router.push("/");
        } else {
          // Login failed, handle accordingly (e.g., show error message)
          this.loginFailed = true;
          console.error("Login failed:", data.message);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
  },
};
</script>
<style></style>
