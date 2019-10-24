<template>
  <transition name="fade" appear>
    <main>
      <slot/>
    </main>
  </transition>
</template>

<script>
import config from '~/.temp/config.js';

export default {
  computed: {
    config () {
      return config
    }
  }
}
</script>

<style src="~/assets/css/main.css"></style>
