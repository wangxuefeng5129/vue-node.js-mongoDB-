<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition " :class="{'md-show':mdShows}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click='closeModals'>Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="login-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShows" @click="closeModals"></div>
  </div>
</template>


<script>
  export default{
    props:["mdShows"],
    data(){
      return{
      }
    },
    methods:{
      closeModals(){
        this.$emit("close");
      }
    }
  }
</script>

<style>
  
</style>