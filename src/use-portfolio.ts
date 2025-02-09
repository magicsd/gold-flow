import { useState } from 'react'
import { PortfolioItem } from './types'

const GOLDEN_RATIO = 1.618 // Золотое сечение

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState<string>('')

  // ✅ Добавление категории
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
      selectedParentId ? updateCategoryRecursive(prev, selectedParentId, newCategory) : [...prev, newCategory]
    )

    setNewCategoryName('')
  }

  // ✅ Рекурсивное обновление вложенных категорий
  const updateCategoryRecursive = (items: PortfolioItem[], parentId: string, newCategory: PortfolioItem) =>
    items.map((item) =>
      item.id === parentId
        ? { ...item, children: [...item.children, newCategory] }
        : {
            ...item,
            children: updateCategoryRecursive(item.children, parentId, newCategory),
          }
    )

  // ✅ Распределение суммы инвестирования по золотому сечению
  const distributeInvestment = () => {
    const total = investmentAmount
    const weights = portfolio.map((_, i) => Math.pow(GOLDEN_RATIO, -i))
    const totalWeight = weights.reduce((a, b) => a + b, 0)

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

    const weights = category.children.map((_, i) => Math.pow(GOLDEN_RATIO, -i))
    const totalWeight = weights.reduce((a, b) => a + b, 0)

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

  // ✅ Получение всех категорий в удобном формате для `<select>`
  const getAllCategories = (
    items: PortfolioItem[],
    depth: number = 0
  ): {
    id: string
    name: string
  }[] =>
    items.flatMap((item) => [
      {
        id: item.id,
        name: '─'.repeat(depth) + ' ' + item.name,
      },
      ...getAllCategories(item.children, depth + 1),
    ])

  return {
    portfolio,
    investmentAmount,
    selectedParentId,
    newCategoryName,
    setInvestmentAmount,
    setSelectedParentId,
    setNewCategoryName,
    addCategory,
    distributeInvestment,
    getAllCategories,
  }
}
