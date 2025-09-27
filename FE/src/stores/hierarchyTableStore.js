import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useHierarchyTableStore = defineStore('hierarchyTableStore', () => {
  // Raw data from the json file
  const rawData = ref([])

  // Map for lookups by ID
  const normalizedData = ref(new Map())

  // Set of expanded items (by ids)
  const expandedItems = ref(new Set())

  // Getters - triggers when rawData changes
  const hierarchyData = computed(() => {
    return rawData.value.map((item) => normalizeItem(item, null))
  })

  // Total count of items
  const totalItemsCount = computed(() => {
    return normalizedData.value.size
  })

  // Currently expanded items
  const expandedItemsCount = computed(() => {
    return expandedItems.value.size
  })

  // Transform nested JSON into parent-child relationships
  const normalizeItem = (item, parentId = null) => {
    const id = item.data.ID

    const normalizedItem = {
      id: id,
      parentId,
      data: { ...item.data },
      children: [],
      hasChildren: false,
      level: parentId ? (normalizedData.value.get(parentId)?.level || 0) + 1 : 0,
    }

    // Recursively process nested children
    if (item.children && typeof item.children === 'object') {
      Object.keys(item.children).forEach((childType) => {
        if (item.children[childType].records && Array.isArray(item.children[childType].records)) {
          item.children[childType].records.forEach((childItem) => {
            const childNormalized = normalizeItem(childItem, id)
            normalizedItem.children.push(childNormalized)
          })
        }
      })
      normalizedItem.hasChildren = normalizedItem.children.length > 0
    }

    // Store in map
    normalizedData.value.set(id, normalizedItem)
    return normalizedItem
  }

  const getData = async () => {
    try {
      // Clear existing data
      rawData.value = []
      normalizedData.value.clear()
      expandedItems.value.clear()

      // Import json
      const response = await import('@/assets/example-data.json')
      rawData.value = response.default

      const hierarchyDataValue = hierarchyData.value

      console.log('Data loaded successfully!', {
        totalItems: normalizedData.value.size,
        hierarchyItems: hierarchyDataValue.length,
      })
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  // Expand/Collapse function
  const toggleItem = (itemId) => {
    if (!itemId) {
      console.warn('Invalid itemId')
      return false
    }

    const wasExpanded = expandedItems.value.has(itemId)

    if (wasExpanded) {
      expandedItems.value.delete(itemId)
      console.log('Collapsed item:', itemId)
    } else {
      expandedItems.value.add(itemId)
      console.log('Expanded item:', itemId)
    }

    return !wasExpanded
  }

  // Expand all items that have children
  const expandAll = () => {
    let expandedCount = 0
    normalizedData.value.forEach((item) => {
      if (item.hasChildren) {
        expandedItems.value.add(item.id)
        expandedCount++
      }
    })
    console.log(`Expanded ${expandedCount} items`)
  }

  // Collapse all items
  const collapseAll = () => {
    const currentlyExpanded = expandedItems.value.size
    expandedItems.value.clear()
    console.log(`Collapsed ${currentlyExpanded} items`)
  }

  // Check if item is expanded (if id is in set)
  const isExpanded = (itemId) => {
    return expandedItems.value.has(itemId)
  }

  // Collect all children for nested deletion
  const getAllChildrenIds = (itemId) => {
    const children = []
    const item = normalizedData.value.get(itemId)

    if (!item) return children

    const collectChildren = (currentItem) => {
      if (currentItem.children && currentItem.children.length > 0) {
        currentItem.children.forEach((child) => {
          children.push(child.id)
          collectChildren(child)
        })
      }
    }

    collectChildren(item)
    return children
  }

  // Remove item and all its children
  const removeItem = (itemId) => {
    if (!itemId) {
      console.warn('Invalid itemId')
      return false
    }

    const item = normalizedData.value.get(itemId)
    if (!item) {
      console.warn('Item not found:', itemId)
      return false
    }

    const childrenIds = getAllChildrenIds(itemId)
    const allIdsToRemove = [itemId, ...childrenIds]

    console.log('Removing item and its children:', {
      itemId,
      itemName: item.data.Name || item.data.ID,
      childrenCount: childrenIds.length,
      allIds: allIdsToRemove,
    })

    allIdsToRemove.forEach((id) => {
      expandedItems.value.delete(id)
    })

    allIdsToRemove.forEach((id) => {
      normalizedData.value.delete(id)
    })

    // Remove from rawData
    const removeFromRawData = (items, targetId) => {
      return items.filter((item) => {
        if (String(item.data.ID) === String(targetId)) {
          return false
        }
        // Recursively clean children array
        if (item.children && typeof item.children === 'object') {
          Object.keys(item.children).forEach((childType) => {
            if (
              item.children[childType].records &&
              Array.isArray(item.children[childType].records)
            ) {
              item.children[childType].records = removeFromRawData(
                item.children[childType].records,
                targetId,
              )
            }
          })
        }
        return true
      })
    }

    rawData.value = removeFromRawData(rawData.value, itemId)

    normalizedData.value.clear()
    
    const _ = hierarchyData.value

    console.log('Item removed successfully')
    return true
  }

  return {
    rawData,

    hierarchyData,
    totalItemsCount,
    expandedItemsCount,

    getData,
    toggleItem,
    expandAll,
    collapseAll,
    removeItem,
    isExpanded,
  }
})
