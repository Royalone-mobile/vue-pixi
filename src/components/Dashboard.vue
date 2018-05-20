<template lang="html">
  <div>
    <div class="header">
      <p class="name" v-on:mouseover="onMouseOver(1)" v-on:mouseleave="onMouseLeave(1)">Ramin Tahbaz-Salehi</p>
      <p class="all-product" v-on:mouseover="onMouseOver(2)" v-on:mouseleave="onMouseLeave(2)">view all projects</p>
    </div>
    <div class="arrows">
      <div class="up" v-on:mouseover="onMouseOver(3)" v-on:mouseleave="onMouseLeave(3)">
        <span class="icon-chevron-up arrow-up arrow-up-12" v-on:click="onClickArrow(1)"></span>
      </div>
      <div class="down" v-on:mouseover="onMouseOver(4)" v-on:mouseleave="onMouseLeave(4)">
        <span class="icon-chevron-down arrow-down arrow-up-12" v-on:click="onClickArrow(2)"></span>
      </div>
    </div>
    <div class="indicator">
      <indicator v-for="n in 5" :key="n" :sceneindex="sceneIndex" :index="n - 1" :title="indicators[n - 1]"></indicator>
    </div>
    <div class="scene-description">
      <p>{{ sceneDescription.title[sceneIndex] }}</p>
      <p>{{ sceneDescription.desc[sceneIndex] }}</p>
    </div>
    <div class="link">
      <div class="dribbble" v-on:mouseover="onMouseOver(5)" v-on:mouseleave="onMouseLeave(5)">
        <span class="icon icon-mail"></span>
      </div>
      <div class="email" v-on:mouseover="onMouseOver(6)" v-on:mouseleave="onMouseLeave(6)">
        <span class="icon icon-dribbble""></span>
      </div>
    </div>
    <div class="free-ninja">
    </div>
    <div id="cvs">
    </div>
  </div>
</template>
<script>
import { Container, WebGLRenderer, Sprite, Graphics, Filter, Matrix } from './../assets/javascripts/pixi.min.js'
import { TimelineMax, TweenMax } from "gsap"

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
      // Video
      video: null,
      // objectFlag
      // overObjectFlag: 0,
      // GSAP
      tween1: null,
      tween2: null,
      timeline: null,
      // DOM
      box: null,
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
    this.interval = 1000 / this.fps
    this.then = Date.now()

    // GSAP
    this.timeline = new TimelineMax({repeat:1000})

    // DOM
    this.box = document.getElementsByClassName("free-ninja")[0]
    
    this.onReload()
  },
  methods: {
    onMouseOver: function (objectId){
      console.log("over - ", objectId)
      this.gsapFunc(objectId, true)
    },
    onMouseLeave: function (objectId){
      console.log("leave - ", objectId)
      this.gsapFunc(objectId, false)
    },
    onClickArrow: function (direction){
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
      // this.onClick()
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
        console.log("counter - ", this.counter)
        this.stage.removeChild(this.mask)
        if (this.$store.state.sceneIndex === 1) {
          this.renderer.render(this.stage)
        } else {
          this.isUpdate = false
          this.renderer.render(this.stage)
        }
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
    drawBackground: function (bgIndex){
      this.stage.interactive = true

      this.container.position.x = this.renderer.width / 2
      this.container.position.y = this.renderer.height / 2
      console.log(bgIndex)
      if (bgIndex === 1) {
        this.video = document.createElement("video");
        this.video.preload = "auto";
        this.video.loop = true;              // enable looping
        // this.video.autoplay = true;          // if PIXI doesn't start it internally
        this.video.src = "static/movies/man-mov_3.mp4";

        var texture = PIXI.Texture.fromVideo(this.video)
        this.bg = new PIXI.Sprite(texture)
      } else {
        this.bg = PIXI.Sprite.fromImage('static/images/' + bgIndex + '.jpg')
      }

      this.bg.anchor.x = .5
      this.bg.anchor.y = .5
      this.bg.position.x = 0
      this.bg.position.y = 0
      this.bg.width = this.width
      this.bg.height = this.height
      
      this.container.addChild(this.bg)
      this.stage.addChild(this.container)
      this.renderer.render(this.stage)
    },
    gsapFunc: function (objectId, onOffFlag){
      if (objectId === 1){
        if (onOffFlag){
          var element = document.querySelector(".header > .name")
          var start = element.offsetLeft - 20
          this.tween1 = TweenMax.fromTo(this.box, 1, 
            {top: "50px", left: start, width: "0px", height: "3px", backgroundColor: "#0f0", }, // 0b3c91
            {left: (start + 60) + "px", width: "10px", ease:Linear.easeNone})
          this.tween2 = TweenMax.fromTo(this.box, 1, 
            {left: (start + 60) + "px"},
            {left: (start + 120) + "px", width: "0px"})

          this.timeline.clear()
          this.timeline.add([this.tween1, this.tween2], "+=0", "sequence")
        } else {
          this.timeline.kill()
          tween = TweenMax.to(this.box, 0, {width: "0"})
        }
      } else if (objectId === 2) {
        if (onOffFlag){
          var element = document.querySelector(".header > .all-product")
          var start = element.offsetLeft - 10
          this.tween1 = TweenMax.fromTo(this.box, 1, 
            {top: "53px", left: start, width: "0px", height: "3px", backgroundColor: "#0f0", }, // 0b3c91
            {left: (start + 70) + "px", width: "10px", ease:Linear.easeNone})
          this.tween2 = TweenMax.fromTo(this.box, 1, 
            {left: (start + 70) + "px"},
            {left: (start + 140) + "px", width: "0px"})

          this.timeline.clear()
          this.timeline.add([this.tween1, this.tween2], "+=0", "sequence")
        } else {
          this.timeline.kill()
          tween = TweenMax.to(this.box, 0, {width: "0"})
        }
      } else if (objectId === 3) {
        var element = document.querySelector("div.arrows > div.up")
        var elementSpan = document.querySelector("div.arrows > div.up > span")
        if (onOffFlag){
          var tween0 = TweenMax.to(element, 0.3, {css: {marginBottom: 15}})
          var tween1 = TweenMax.to(elementSpan, 0, {css: {color: '#00f'}})
        } else {
          TweenMax.killAll()
          var tween0 = TweenMax.to(element, 0, {css: {marginBottom: 10}})
          var tween1 = TweenMax.to(elementSpan, 0, {css: {color: '#fff'}})
        }
      } else if (objectId === 4) {
        var element0 = document.querySelector("div.arrows > div.down")
        var element1 = document.querySelector("div.arrows > div.up")
        var elementSpan = document.querySelector("div.arrows > div.down > span")
        if (onOffFlag){
          var tween1 = TweenMax.to(element1, 0.3, {css: {marginBottom: 15}})
          var tween0 = TweenMax.to(element0, 0.3, {css: {marginBottom: -5}})
          var tween2 = TweenMax.to(elementSpan, 0, {css: {color: '#00f'}})
        } else {
          TweenMax.killAll()
          var tween0 = TweenMax.to(element0, 0, {css: {marginBottom: 0}})
          var tween1 = TweenMax.to(element1, 0, {css: {marginBottom: 10}})
          var tween2 = TweenMax.to(elementSpan, 0, {css: {color: '#fff'}})
        }
      } else if (objectId === 5) {
        var element0 = document.querySelector("div.link > div.dribbble > span")
        if (onOffFlag){
          var tween1 = TweenMax.to(element0, 0.3, {css: {color: '#008'}})
        } else {
          TweenMax.killAll()
          var tween1 = TweenMax.to(element0, 0.3, {css: {color: '#fff'}})
        }
      } else if (objectId === 6) {
        var element0 = document.querySelector("div.link > div.email > span")
        if (onOffFlag){
          var tween1 = TweenMax.to(element0, 0.3, {css: {color: '#008'}})
        } else {
          TweenMax.killAll()
          var tween1 = TweenMax.to(element0, 0.3, {css: {color: '#fff'}})
        }
      }
    },
  },
  computed: mapState({
    sceneIndex: state => state.sceneIndex
  }),
}
</script>