<template>
  <div class="hierarchy-row-container">
    <HierarchyItem
      :item="item"
      :columns="columns"
      :level="level"
      :is-expanded="isExpanded"
      @toggle="onToggle"
      @remove="onRemove"
    />

    <Transition name="slide-fade">
      <div
        v-show="isExpanded && item.children && item.children.length > 0"
        class="children-container"
      >
        <div class="child-header" :style="{ '--level': level + 1 }">
          <div class="child-header-row">
            <div class="child-header-expand">🐨</div>
            <div
              v-for="column in childColumns"
              :key="`${level + 1}-${column}`"
              class="child-header-item"
            >
              {{ column }}
            </div>
            <div class="child-header-actions">Delete</div>
          </div>
        </div>

        <HierarchyRow
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          :get-columns-for-level="getColumnsForLevel"
          @item-toggled="onChildToggled"
          @item-removed="onChildRemoved"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHierarchyTableStore } from '@/stores/hierarchyTableStore'
import HierarchyItem from './HierarchyItem.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  getColumnsForLevel: {
    type: Function,
    required: true,
  },
})

// Get columns for current level
const columns = computed(() => {
  const cols = props.getColumnsForLevel(props.level)
  return cols
})

// Get columns for child level
const childColumns = computed(() => {
  const childLevel = props.level + 1
  const cols = props.getColumnsForLevel(childLevel)
  return cols || []
})

const emit = defineEmits(['item-toggled', 'item-removed'])

const hierarchyStore = useHierarchyTableStore()

const isExpanded = computed(() => {
  return hierarchyStore.isExpanded(props.item.id)
})

// Update state and emit to parent component
const onToggle = () => {
  hierarchyStore.toggleItem(props.item.id)
  emit('item-toggled', props.item.id)
}

// Handle delete
const onRemove = () => {
  const itemName = props.item.data.Name || props.item.data.ID
  const childrenCount = props.item.children?.length || 0

  const confirmMessage =
    childrenCount > 0
      ? `Are you sure you want to remove ${itemName}?\nThis will also remove all child items.`
      : `Are you sure you want to remove ${itemName}?`

  if (confirm(confirmMessage)) {
    console.log('Item removed:', props.item.id, 'with all its children: (', childrenCount, ')')
    emit('item-removed', props.item.id)
  }
}

// Emit to parent component
const onChildToggled = (itemId) => {
  emit('item-toggled', itemId)
}

// Emit to parent component
const onChildRemoved = (itemId) => {
  emit('item-removed', itemId)
}
</script>
