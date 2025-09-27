<template>
  <div
    class="hierarchy-item"
    :class="{
      'has-children': item.hasChildren,
      'is-expanded': isExpanded,
      'is-root': level === 0,
    }"
    :style="{ '--level': level }"
  >
    <div class="item-row" @click="onRowClick">
      <div class="expand-cell">
        <button
          v-if="item.hasChildren"
          @click.stop="onToggle"
          class="expand-btn"
          :class="{ expanded: isExpanded }"
        >
          🐨
        </button>
      </div>

      <div v-for="column in columns" :key="column" class="data-cell">
        <span class="cell-content">
          {{ item.data[column] }}
        </span>
      </div>

      <div class="actions-cell">
        <button @click.stop="onRemove" class="remove-btn">🗑️</button>
      </div>
    </div>

    <div v-if="level > 0" class="level-indicator"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'remove'])

// Emit to parent component
const onToggle = () => {
  emit('toggle')
}

// Emit to parent component
const onRemove = () => {
  emit('remove')
}

// Emit to parent component
const onRowClick = () => {
  if (props.item.hasChildren) {
    emit('toggle')
  }
}
</script>
