<template lang="html">
  <div>
    <div class="header">
      <p class="name">Ramin Tahbaz-Salehi</p>
      <p class="all-product">view all projects</p>
    </div>
    <div class="arrows">
      <img src="./../assets/images/arrow-up-12.svg" class="arrow-up-12" v-on:click="onClickArrow(1)">
      <img src="./../assets/images/arrow-down-12.svg" class="arrow-down-12" v-on:click="onClickArrow(2)">
    </div>
    <div class="indicator">
      <indicator v-for="n in 5" :sceneindex="sceneIndex" :index="n - 1" :title="indicators[n - 1]"></indicator>
    </div>
    <div class="scene-description">
      <p>{{ sceneDescription.title[sceneIndex] }}</p>
      <p>{{ sceneDescription.desc[sceneIndex] }}</p>
    </div>
    <div class="link">
      <img src="./../assets/images/email-send-1.svg" class="email-send-1">
      <img src="./../assets/images/logo-dribbble.svg" class="logo-dribble">
    </div>
    <div id="cvs">
    </div>
  </div>
</template>
<script>
import {Container, WebGLRenderer, Sprite, Graphics, Filter, Matrix} from './../assets/javascripts/pixi.min.js'

import { mapState } from 'vuex';

import Indicator from './Indicator.vue';

export default {
  props: {
  },
  components: {
    Indicator,
  },
  data: () => {
    return {
      // Static strings
      indicators: ['welcome', 'Hi', 'Good', 'Working', 'Design'],
      sceneDescription: {
        title: ['Hello everyone!', 'Hi, you know?', 'Really impressive!', 'Gotcha!', 'Soon!!!'],
        desc: ['I’m an American UX/UI designer in Washington, DC currently working at Freddie Mac.',
                '2nd scene description',
                '3nd scene description',
                '4nd scene description',
                '5nd scene description',
              ]
      },
      // Screen
      width: 0,
      height: 0,
      // Container
      container: null,
      stage: null,
      // Mask
      bg: null,
      mask: null,
      maskScale: 0,
      // Renderer
      renderer: null,
      // Request
      requestId: '',
      // Counter
      counter: 0,
      // Update?
      isUpdate: false,
      // Frame
      fps: 20,
      now: 0,
      then: 0,
      interval: 0,
      delta: 0,
    }
  },
  updated (){
    // console.log("aaa - ", this.$store.state.sceneIndex)
    this.onReload()
  },
  mounted: function () {
    // Add Listener
    window.addEventListener('resize', this.onResize)

    // Screen size
    this.width = window.innerWidth
    this.height = window.innerHeight

    // Create PIXI objects
    this.container = new PIXI.Container()
    this.stage = new PIXI.Container()
    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height, {antialias: true})
    document.getElementById("cvs").appendChild(this.renderer.view)

    // Frame
    this.interval = 1001 / this.fps
    this.then = Date.now()
    
    this.onReload()
  },
  methods: {
    onClickArrow: function(direction){
      var index = this.$store.state.sceneIndex
      if (direction === 1) index--
      else if (direction === 2) index++

      index = index === 5 ? 0 : index
      index = index === -1 ? 4 : index
      this.$store.commit('updateSceneIndex', index)
    },
    onReload: function (){
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.container.removeChild(this.bg)
      this.drawBackground(this.$store.state.sceneIndex)
      this.onClick()
    },
    onResize(event) {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.renderer.view.style.width = this.width + 'px'
      this.renderer.view.style.height = this.height + 'px'
      this.container.removeChild(this.bg)
      this.drawBackground(this.$store.state.sceneIndex)
    },
    onClick: function (){
      this.counter = 0
      this.isUpdate = true

      this.stage.removeChild(this.mask);
      this.container.mask = null;

      this.mask = PIXI.Sprite.fromImage('static/images/cloud-texture4.png')
      this.mask.anchor.x = .5 
      this.mask.anchor.y = .5
      this.mask.position.x = this.renderer.width / 2 + (100 - Math.floor(Math.random() * 200))
      this.mask.position.y = this.renderer.height / 2 + (100 - Math.floor(Math.random() * 200))
      this.mask.width = 100
      this.mask.height = 100
      this.mask.alpha = 0.9
      this.mask.rotation = Math.floor(Math.random() * 11)

      this.stage.addChild(this.mask)
      this.container.mask = this.mask

      this.animate()
    },
    animate: function (){
      if (this.counter > 15){
      console.log("counter - ", this.counter);
        this.isUpdate = false
        this.stage.removeChild(this.mask);
        this.renderer.render(this.stage)
      }

      if (this.isUpdate) requestAnimationFrame(this.animate)

      this.now = Date.now()
      this.delta = this.now - this.then
       
      if (this.delta > this.interval) {
        this.then = this.now - (this.delta % this.interval)

        this.mask.width += this.counter++ * 50
        this.mask.height += this.counter * 50
        this.renderer.render(this.stage)
      }
    },
    drawBackground: function(bgIndex) {
      this.stage.interactive = true

      this.container.position.x = this.renderer.width / 2
      this.container.position.y = this.renderer.height / 2
      this.bg = PIXI.Sprite.fromImage('static/images/' + bgIndex + '.jpg')
      this.bg.anchor.x = .5
      this.bg.anchor.y = .5
      this.bg.position.x = 0
      this.bg.position.y = 0
      this.bg.width = this.width
      this.bg.height = this.height
      
      this.container.addChild(this.bg)
      this.stage.addChild(this.container)
      this.renderer.render(this.stage)
    }
  },
  computed: mapState({
    sceneIndex: state => state.sceneIndex
  }),
}
</script>