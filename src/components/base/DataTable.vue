<script setup lang="ts">
import { computed, ref, watch, capitalize } from "vue";

const props = defineProps<{
  items: any[];
  showRemoveButtons?: boolean;
}>();

const selectedItem = defineModel<any[]>("selected", {
  required: false,
  default: null,
});

const columns = computed(() => {
  if (!props.items || props.items.length === 0) return [];
  return Object.keys(props.items[0]);
});
</script>

<template>
  <!-- <DataTable :value="props.items" scrollable scrollHeight="flex" removableSort>
    <Column field="text" sortable header="Text"></Column>
    <Column field="shortcut" sortable header="Shortcut"></Column>
  </DataTable> -->
  <!-- <table>
    <thead>
      <tr>
        <th class="remove-buttons" v-if="showRemoveButtons"></th>
        <th v-for="column in columns" :key="column">
          {{ capitalize(column) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in props.items" :key="index">
        <td class="remove-buttons" v-if="showRemoveButtons">
          <button @click="() => console.log(item)">Remove</button>
        </td>
        <td v-for="column in columns" :key="`${index}-${column}`">
          {{ item[column] }}
        </td>
      </tr>
    </tbody>
  </table> -->
</template>

<style scoped>
/* div {
  ::-webkit-scrollbar {
    width: 9px;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: var(--nm-inset);
    border-radius: 0 100px 100px 0;
  }
}
table {
  position: relative;
  text-align: left;
  width: 100%;
  border-collapse: collapse;

  .remove-buttons {
    color: var(--red);
    width: 0;
    display: none;
  }

  thead {
    position: sticky;
    width: 100%;
    top: 0;
    background-color: var(--color-1);
  }

  th,
  td {
    height: 50px;
    padding: 10px;
  }

  tbody {
    tr {
      padding: 10px;
      border-radius: 10px;
      transition: background-color 0.2s ease;
    }
  }
} */
</style>
