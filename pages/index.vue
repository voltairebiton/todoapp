<template>
  <v-row no-gutters class="fill-height justify-center align-center">
      <v-col class="d-flex justify-center"  >
          <v-card outlined  rounded="lg" width="500px">
            <v-card-title>
              <span>Checklist</span>
              <v-spacer></v-spacer>
              <!-- <v-btn text><v-icon>mdi-dots-vertical</v-icon></v-btn> -->
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-btn :color="selectedTab == 0 ? 'grey': ''" :dark="selectedTab == 0" class="ma-4" rounded elevation="0" @click="selectedTab = 0">Pending</v-btn>
                <v-btn :color="selectedTab == 1 ? 'grey': ''" :dark="selectedTab == 1" class="ma-4" rounded elevation="0" @click="selectedTab = 1">Completed</v-btn>
              </v-row>
              <v-tabs-items v-model="selectedTab">
                <v-tab-item :value="0">
                  <transition-group name="list" tag="v-list" >
                    <v-list-item dense v-for="(item, i) in getPending" :key="item.text">
                      <v-checkbox v-model="item.value" :label="item.text" :class="item.value ? 'checked': ''" @change="setAsCompleted($event, i)"></v-checkbox>
                    </v-list-item>
                  </transition-group>
                </v-tab-item>
                <v-tab-item :value="1">
                  <transition-group name="list" tag="v-list" >
                    <v-list-item  v-for="(item, i) in getCompleted" :key="item.text">
                      <v-checkbox v-model="item.value" :label="item.text" @change="setAsPending($event, i)"></v-checkbox>
                    </v-list-item>
                  </transition-group>
                </v-tab-item>
              </v-tabs-items>

              </v-list>
            </v-card-text>
            <v-card-actions class="d-flex align-center">
              <v-text-field v-model="todoField" outlined placeholder="Add an item field here" @keyup.enter="addTodo" hide-details="" class="pr-4"></v-text-field>
              <v-btn :disabled="!todoField" rounded color="info" @click="addTodo">Add item</v-btn>
            </v-card-actions>
            <transition name="alert" >
              <v-alert v-if="showAlert" tile class="ma-3" type="error" >Duplicate item</v-alert>
            </transition>
          </v-card>
      </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue'

declare interface todoItem {
  value: boolean,
  text: String
} 

export default Vue.extend({
  data() {
    return {
      todoField: '',
      selectedTab: 0,
      showAlert: false
    }
  },
  computed: {
    getPending() {
      return this.$store.getters.getPending;
    },
    getCompleted() {
      return this.$store.getters.getCompleted;
    }
  },
  methods: {
    addTodo() {
      const pending = this.$store.getters.getPending;
      if (pending.some(e => e.text === this.todoField)) {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        return true;
      }
      pending.push({value: false, text: this.todoField});
      this.todoField = '';
      this.$store.commit('setPending', pending);
    },
    setAsCompleted(event: boolean, index: any) {
      const pending = this.getPending;
      const completed = this.getCompleted;
      if (event) {
        completed.push(pending[index]);
        this.$store.commit('setCompleted', completed);
        setTimeout(() => {
          pending.splice(index, 1);
          this.$store.commit('setPending', pending);
        }, 500);
      }
    },
    setAsPending(event: boolean, index: any) {
      const pending = this.getPending;
      const completed = this.getCompleted;

      if (!event) {
        pending.push(completed[index]);
        this.$store.commit('setPending', pending);
        setTimeout(() => {
          completed.splice(index, 1);
          this.$store.commit('setCompleted', completed);
        }, 500);
      }
    }
  }
})
</script>
<style lang="scss" scoped>
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active{
    transition: all 1s;
  }
  .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .v-list-item {
    .checked ::v-deep .v-label {
      text-decoration: line-through;
    }
  }
  .v-window-item { 
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .alert-enter-to, .alert-leave-to {
    transition: all ease .3s;
  }

  .alert-enter, .alert-leave-to {
    opacity: 0;
    transform: scale(0);
  }

</style>