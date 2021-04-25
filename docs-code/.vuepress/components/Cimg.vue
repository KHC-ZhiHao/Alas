<template>
  <figure align='center' style="padding-top: 16px">
    <img :src="imagesrc" alt=""/>
    <figcaption>
        <i>
            <small>{{ text }}</small>
        </i>
    </figcaption>
  </figure>
</template>

<script>
export default {
    props: ['src', 'text'],
    computed: {
        imagesrc () {
            return '/Alas/images/' + this.src
        }
    }
}
</script>
