<template>
  <div class="each-indicator" :sceneIndex="sceneIndex">
    <span v-if="isActive">{{ title }}</span>
    <img src="./../assets/images/line.svg" class="line" v-if="isActive">
    <div class="rect" v-on:click="onClick()" v-on:mouseover="onMouseOver()" v-on:mouseleave="onMouseLeave()" v-bind:class="{ activeRect: (isMouseOver || isActive) }">
      <div class="inner-rect" v-bind:class="{ activeInnerRect: isActive }">
      </div>
    </div>
  </div>
</template>
<script>
import store from './../store';

import { mapState } from 'vuex';

export default {
  props: ['sceneindex', 'index', 'title'],
  data: () => {
    return {
      isMouseOver: false,
      isActive: false,
    }
  },
  beforeUpdate (){
    this.isActive = (parseInt(this.sceneindex) === parseInt(this.index)) ? true : false
  },
  mounted: function () {
    // console.log("tit - ", this.title)
    // console.log("index - ", this.index)
    this.isActive = (this.sceneindex === parseInt(this.index)) ? true : false
  },
  methods: {
    onMouseOver: function (){
      this.isMouseOver = true
    },
    onMouseLeave: function (){
      this.isMouseOver = false
    },
    onClick: function (){
      this.$store.commit('updateSceneIndex', this.index)
    },
  },
  computed: mapState({
    sceneIndex: state => state.sceneIndex
  }),
}
</script>