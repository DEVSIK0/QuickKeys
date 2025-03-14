<script setup lang="ts">
const props = defineProps<{
  /**
   * Size of the button, X and Y (in pixels).
   */
  size: [x: number, y: number];

  /**
   * Size of the icon (in pixels).
   */
  iconSize: number;

  /**
   * Thickness of the border (in pixels).
   */
  borderThickness: number;

  /**
   * Button is disabled.
   */
  disabled?: boolean;
}>();

const check = defineModel<boolean>("checked", {
  default: false,
});
</script>

<template>
  <input
    type="checkbox"
    v-model="check"
    :disabled="props.disabled"
    :style="`height: ${props.size[0]}px; width: ${props.size[1]}px; font-size: ${props.iconSize}px; border: ${props.borderThickness}px solid #eef0f4;`"
  />
</template>

<style scoped>
input[type="checkbox"] {
  appearance: none;
  box-shadow: 9.91px 9.91px 15px #d9dade, -9.91px -9.91px 15px #ffffff;
  border-radius: 50%;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.1s;

  &:disabled {
    cursor: default;
  }
}
input[type="checkbox"]::after {
  font-family: FontAwesome;
  content: "\f011";
  color: #7a7a7a;
}
input[type="checkbox"]:checked {
  box-shadow: 9.91px 9.91px 15px #d9dade, -9.91px -9.91px 15px #ffffff,
    inset 9.91px 9.91px 15px #d9dade, inset -9.91px -9.91px 15px #ffffff;
}
input[type="checkbox"]:checked::after {
  color: var(--success);
}
</style>
