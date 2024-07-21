<template>
    <div ref="player"></div>
  </template>
  
  <script>
  import YouTubePlayer from 'youtube-player';
  
  export default {
    props: {
      videoId: {
        type: String,
        required: true,
      },
    },
    mounted() {
      this.player = YouTubePlayer(this.$refs.player, {
        videoId: this.videoId,
        playerVars: { autoplay: 1 },
      });
    },
    beforeDestroy() {
      if (this.player) {
        this.player.destroy();
      }
    },
  };
  </script>
  