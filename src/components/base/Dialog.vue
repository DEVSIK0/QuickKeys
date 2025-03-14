<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();
</script>

<template>
  <dialog id="alert-dialog" :open="props.open">
    <h3>¡Vuelve a la sombra!</h3>
    <img src="#" alt="Gandalf" />
    <p>¡NO... PUEDES... PASAR!</p>
    <form method="dialog">
      <button>Ok!</button>
    </form>
  </dialog>
</template>

<style scoped>
#alert-dialog {
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}

#alert-dialog::backdrop {
  /* background: linear-gradient(#000d, #000a); */
}

#alert-dialog:not([open])::backdrop {
  /* opacity: 0; */
}
</style>
