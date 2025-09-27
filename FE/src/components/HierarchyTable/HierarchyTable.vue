<template>
  <div class="hierarchy-table">
    <div class="ht-header">
      <div class="ht-header-row">
        <div class="header-item expand-item">🐨</div>
        <div class="header-item" v-for="column in columns" :key="column">
          {{ column }}
        </div>
        <div class="header-item actions-item">Actions</div>
      </div>
    </div>

    <div class="hierarchy-table-body">
      <div v-if="data.length === 0" class="empty-table">
        <div class="empty-icon">🐨</div>
        <p>No data available</p>
      </div>

      <div v-else>
        <HierarchyRow
          v-for="item in data"
          :key="item.id"
          :item="item"
          :level="0"
          :get-columns-for-level="getColumnsForLevel"
          @item-toggled="onItemToggled"
          @item-removed="onItemRemoved"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HierarchyRow from './HierarchyRow.vue'

// Root-level items
defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['item-toggled', 'item-removed'])

// Defines what columns show at each nesting level
const getColumnsForLevel = (level) => {
  let columns
  switch (level) {
    case 0:
      columns = [
        'ID',
        'Name',
        'Gender',
        'Ability',
        'Minimal distance',
        'Weight',
        'Born',
        'In space since',
        'Beer consumption (l/y)',
        'Knows the answer?',
      ]
      break
    case 1:
      columns = ['ID', 'Character ID', 'Is alive?', 'Years']
      break
    case 2:
      columns = ['ID', 'Nemesis ID', 'Secrete Code']
      break
  }
  return columns
}

const columns = computed(() => {
  return getColumnsForLevel(0)
})

// Emit event to parent component
const onItemToggled = (itemId) => {
  emit('item-toggled', itemId)
}

// Emit event to parent component
const onItemRemoved = (itemId) => {
  emit('item-removed', itemId)
}
</script>
