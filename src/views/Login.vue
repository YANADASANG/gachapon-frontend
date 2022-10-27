<template>
  <v-container fluid class="bg">
    <!-- alert -->
    <v-snackbar v-model="alert"  :color="alertColor" :timeout="1350" top center>
      <span>{{alertText}}</span>
    </v-snackbar>
    <v-row>
      <v-col cols="1"></v-col>

      <v-col cols="7">
        <div class="space-head">
          <h1>SLOT MACHINE</h1>
          <h1>GACHAPON</h1>
        </div>

        <div class="space">
          <!-- login form -->
          <v-dialog v-model="loginForm" max-width="600px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-large color="error" dark v-bind="attrs" v-on="on">
                <span>LOG IN</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Login</span><v-spacer></v-spacer>
                <v-btn icon @click="loginForm = false , usernameLogin = '', passwordLogin = ''">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="username"
                        required
                        v-model="usernameLogin"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Password*"
                        type="password"
                        required
                        v-model="passwordLogin"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="loginSubmit">
                  log in
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

        <div class="space">
          
          
          <!-- sign up form -->
          <v-dialog v-model="signUpForm" max-width="600px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-large color="error" dark v-bind="attrs" v-on="on">
                <span>SIGN UP</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Sign Up</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="signUpForm = false, usernameSignUp = '', passwordSignUp = ''">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="username"
                        required
                        v-model="usernameSignUp"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Password*"
                        type="password"
                        required
                        v-model="passwordSignUp"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="signUpSubmit">
                  sign up
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Login-page",
  data: () => ({
    alert: false,
    loginForm: false,
    signUpForm: false,

    alertText : "",
    alertColor : "",
    usernameLogin: "",
    passwordLogin: "",
    usernameSignUp: "",
    passwordSignUp: "",
  }),
  methods: {
    async loginSubmit() {
      if (this.usernameLogin !== "" && this.passwordLogin !== "") {
        const login = await axios.post("http://localhost:8081/user/name/", {
          user_name: this.usernameLogin,
          user_password: this.passwordLogin,
        });
        if (login.data.message !== "Wrong username or password") {
          this.alertText = `Welcome! ${login.data[0].user_name}`;
          localStorage.setItem("userID", login.data[0].user_id);
          this.alertColor = "blue"
          setTimeout(() => (this.$router.push("/gachapon"),this.loginForm = false), 1350);   
        } 
        else {
          this.alertText = login.data.message ;
          this.usernameLogin = "";
          this.passwordLogin = "";
          this.alertColor = "red"
        }
        this.alert = true
      }
    },

    async signUpSubmit() {
      let id;
      if (this.usernameSignUp !== "" && this.passwordSignUp !== "") {
        const signUp = await axios.post("http://localhost:8081/user/", {
          user_name: this.usernameSignUp,
          user_password: this.passwordSignUp,
        });
        if (signUp.data.message !== "This username already use") {
          const userID = await axios.post("http://localhost:8081/user/name/", {
            user_name: this.usernameSignUp,
            user_password: this.passwordSignUp,
          });

          id = userID.data[0].user_id;

          await axios.get("http://localhost:8081/gachapon/" + id + "/newPlayer");

          this.alertText = "SIGN UP SUCCESS"
          this.alertColor = "green"
          setTimeout(() => (this.signUpForm = false,this.usernameSignUp = "",this.passwordSignUp = ""), 1350);             
        } 
        else {
          this.usernameSignUp = "";
          this.passwordSignUp = "";
          this.alertText = signUp.data.message
          this.alertColor = "red"
        }
        this.alert = true
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("../assets/login_bg.svg");
  height: 100%;
  width: 100%;
  background-size: contain;
  background-position: right center;
}
h1 {
  font-size: 74px;
  color: white;
}
span {
  font-size: 20px;
}
.v-btn {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.space {
  padding-bottom: 50px;
}
.space-head {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
