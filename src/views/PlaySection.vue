<template>
  <div>
    <!-- bar -->
    <v-app-bar color="#4f4858" elevation="0">
      <v-btn @click="goToLogin" large color="#F66767">EXIT</v-btn>
      <v-spacer> </v-spacer>
      <v-dialog v-model="rateModal" width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn large color="#FFBD59" v-bind="attrs" v-on="on">RATE</v-btn>
        </template>
        <v-img :src="require('../assets/rate_gacha.svg')" />
      </v-dialog>
    </v-app-bar>
    <v-container fluid>
      <!-- out for coin modal -->
      <v-dialog v-model="coinNotEnoughModal" width="600">
        <v-img :src="require('../assets/out_coin.svg')" />
      </v-dialog>
      <!-- reward  modal -->
      <v-dialog v-model="receivedModal" width="600">
        <v-card align="center">
          <v-img :src="require('../assets/modalBG.svg')">
            <h1 style="color: red">CONGRATULATION !<br />YOU HAVE RECEIVED</h1>
            <v-img :src="require(`../assets/reward/${rewardImage}`)" max-width="300"></v-img>
            <h2>{{ rewardText }}</h2>
            <v-btn @click="openInventory"
              >go to inventory</v-btn
            >
          </v-img>
        </v-card>
      </v-dialog>
      <!-- inventory -->
      <v-dialog v-model="inventoryModal" max-width="750" max-height = "800">
        <v-card height="100%">
          <v-img :src="require('../assets/modalBG.svg')" max-width="750">
            <v-card-title class="ps-8 pt-6"><h1>{{inventoryOwner}}'s inventory</h1></v-card-title>
            <v-row v-for="item in inventory" :key="item.id" class="ms-6" >
              <v-col cols="2">
                <v-img :src="require(`../assets/reward/${item.img}`)" max-width="75"></v-img>
              </v-col>
              <v-col align-self="center">
                <span style="font-size:20px">
                  <b>{{ item.itemname }}</b> amount : {{ item.amount }}
                </span>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-dialog>
      <v-row>
        <!-- pay -->
        <v-col cols="3" class="col">
          <v-img
            :src="require('../assets/spin.svg')"
            width="250"
            class="contain"
          />
        </v-col>
        <!-- slot -->
        <v-col cols="6" align="center">
          <v-img
            :src="require(`../assets/slot/${slot}`)"
            width="420"
            @click="random(remainingCoin)"
            style="cursor: pointer; position: relative; z-index: 1"
          />
          <v-img
            :src="require(`../assets/slot/${slotRate}`)"
            width="240"
            style="top: 48%; position: absolute; left: 32%"
          >
          </v-img>
        </v-col>
        <!-- remainingCoin & inventory -->
        <v-col cols="3" class="col">
          <div class="contain">
            <div class="box">
              <v-img :src="require('../assets/coin.png')" max-width="75" />
              <h1>REMAIN : {{ remainingCoin }}</h1>
            </div>
            <br />
            <v-img
              :src="require('../assets/inventory.svg')"
              width="320"
              @click="openInventory"
              style="cursor: pointer"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "PlaySection",
  data() {
    return {
      inventory: [],

      rateModal: false,
      receivedModal: false,
      inventoryModal: false,
      coinNotEnoughModal: false,
      
      slot: "m_common.svg",
      slotRate: "common.svg",

      rewardText: "",
      rewardImage: "coin.png",
      inventoryOwner:"",
      
      itemID : 0,
      amount : 1,
      remainingCoin: 1000,
    };
  },
  async mounted(){
    const fecthInventory = await axios.get(`http://localhost:8081/gachapon/${localStorage.getItem('userID')}`);
    this.inventoryOwner = fecthInventory.data[0].user_name
    this.inventory = fecthInventory.data[0].user_inventory
    this.remainingCoin = this.inventory.find((item)=>item.itemname=="Coin")
    this.remainingCoin = this.remainingCoin.amount
  },

  methods: {
    goToLogin() {
      localStorage.removeItem('userID')
      return this.$router.push("/");
    },

    async openInventory(){
      const fecthInventory = await axios.get(`http://localhost:8081/gachapon/${localStorage.getItem('userID')}`);
      this.inventory = fecthInventory.data[0].user_inventory
      this.inventoryModal = true
      this.receivedModal = false
    },

    async random(coin) {
      if (coin < 49) {
        this.coinNotEnoughModal = true;
        return;
      }
      const reward = await axios.post(`http://localhost:8081/gachapon/${localStorage.getItem('userID')}/reward`);

      this.rewardText = reward.data.text
      this.rewardImage = reward.data.img

      this.slot = reward.data.slotImg
      this.slotRate = reward.data.slotRateImg

      this.remainingCoin += reward.data.earnedCoins

      await setTimeout(() => (this.receivedModal = true), 500);
    }
   
  }
};
</script>

<style scoped>
.col {
  position: relative;
}

.contain {
  position: absolute;
  bottom: 10%;
}
.box {
  background-color: #d9d9d9;
  width: 320px;
  height: 100px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
