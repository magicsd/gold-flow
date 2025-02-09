import { useState } from 'react'
import { PortfolioItem } from './types'

const GOLDEN_RATIO = 1.618 // Золотое сечение

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState<string>('')

  // ✅ Добавление новой категории (включая подкатегории)
  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: PortfolioItem = {
      id: Date.now().toString(),
      name: newCategoryName,
      amount: 0,
      percentage: 100,
      children: [],
    }

    setPortfolio((prev) =>
      selectedParentId
        ? updateCategoryRecursive(prev, selectedParentId, (parent) => ({
            ...parent,
            children: [...parent.children, newCategory],
          }))
        : [...prev, newCategory]
    )

    setNewCategoryName('')
  }

  // ✅ Редактирование названия категории
  const renameCategory = (id: string, newName: string) => {
    setPortfolio((prev) => updateCategoryRecursive(prev, id, (category) => ({ ...category, name: newName })))
  }

  // ✅ Перемещение категории вверх или вниз
  const moveCategory = (parentId: string | null, categoryId: string, direction: 'up' | 'down') => {
    setPortfolio((prev) => moveCategoryRecursive(prev, parentId, categoryId, direction))
  }

  // ✅ Рекурсивное обновление вложенных категорий
  const updateCategoryRecursive = (
    items: PortfolioItem[],
    id: string,
    updateFn: (category: PortfolioItem) => PortfolioItem
  ): PortfolioItem[] => {
    return items.map((item) =>
      item.id === id ? updateFn(item) : { ...item, children: updateCategoryRecursive(item.children, id, updateFn) }
    )
  }

  // ✅ Рекурсивное перемещение категории
  const moveCategoryRecursive = (
    items: PortfolioItem[],
    parentId: string | null,
    categoryId: string,
    direction: 'up' | 'down'
  ): PortfolioItem[] => {
    if (parentId === null) {
      return reorderItems(items, categoryId, direction)
    }

    return items.map((item) =>
      item.id === parentId
        ? { ...item, children: reorderItems(item.children, categoryId, direction) }
        : {
            ...item,
            children: moveCategoryRecursive(item.children, parentId, categoryId, direction),
          }
    )
  }

  // ✅ Функция перемещения элемента в списке
  const reorderItems = (items: PortfolioItem[], categoryId: string, direction: 'up' | 'down') => {
    const index = items.findIndex((item) => item.id === categoryId)
    if (index === -1) return items

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return items

    const newItems = [...items]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    return newItems
  }

  // ✅ Распределение инвестиций по золотому сечению
  const distributeInvestment = () => {
    const total = investmentAmount
    let weights = portfolio.map((_, i) => Math.pow(GOLDEN_RATIO, -i))
    let totalWeight = weights.reduce((a, b) => a + b, 0)

    setPortfolio((prev) =>
      prev.map((category, i) => distributeInvestmentRecursive(category, total * (weights[i] / totalWeight), 100))
    )
  }

  const distributeInvestmentRecursive = (
    category: PortfolioItem,
    amount: number,
    percentage: number
  ): PortfolioItem => {
    if (category.children.length === 0) return { ...category, amount, percentage }

    let weights = category.children.map((_, i) => Math.pow(GOLDEN_RATIO, -i))
    let totalWeight = weights.reduce((a, b) => a + b, 0)

    return {
      ...category,
      amount,
      percentage,
      children: category.children.map((child, i) => {
        const childAmount = amount * (weights[i] / totalWeight)
        return distributeInvestmentRecursive(child, childAmount, (childAmount / amount) * 100)
      }),
    }
  }

  // ✅ Получение списка всех категорий (вложенные включительно)
  const getAllCategories = (
    items: PortfolioItem[],
    depth: number = 0
  ): {
    id: string
    name: string
  }[] => {
    return items.flatMap((item) => [
      { id: item.id, name: '─'.repeat(depth) + ' ' + item.name },
      ...getAllCategories(item.children, depth + 1),
    ])
  }

  return {
    portfolio,
    setPortfolio,
    investmentAmount,
    setInvestmentAmount,
    selectedParentId,
    setSelectedParentId,
    newCategoryName,
    setNewCategoryName,
    addCategory,
    renameCategory,
    moveCategory,
    distributeInvestment,
    getAllCategories,
  }
}
