import { useState } from 'react'
import { PortfolioItem } from './types'

type Props = {
  portfolio: PortfolioItem[]
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>
}

const GOLDEN_RATIO = 1.618

const PortfolioEditor: React.FC<Props> = ({ portfolio, setPortfolio }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: PortfolioItem = {
      id: Date.now().toString(),
      name: newCategoryName,
      amount: 0,
      percentage: 100,
      children: [],
    }

    if (!selectedParentId) {
      setPortfolio([...portfolio, newCategory])
    } else {
      setPortfolio((prev) => updateCategoryRecursive(prev, selectedParentId, newCategory))
    }

    setNewCategoryName('')
  }

  const updateCategoryRecursive = (items: PortfolioItem[], parentId: string, newCategory: PortfolioItem) => {
    return items.map((item) => {
      if (item.id === parentId) {
        return { ...item, children: [...item.children, newCategory] }
      }
      if (item.children.length > 0) {
        return {
          ...item,
          children: updateCategoryRecursive(item.children, parentId, newCategory),
        }
      }
      return item
    })
  }

  const distributeInvestment = () => {
    const total = investmentAmount
    const weights = portfolio.map((_, index) => Math.pow(GOLDEN_RATIO, -index))
    const totalWeight = weights.reduce((a, b) => a + b, 0)

    const updatedPortfolio = portfolio.map((category, index) =>
      distributeInvestmentRecursive(category, total * (weights[index] / totalWeight), 100)
    )

    setPortfolio(updatedPortfolio)
  }

  const distributeInvestmentRecursive = (
    category: PortfolioItem,
    amount: number,
    percentage: number
  ): PortfolioItem => {
    if (category.children.length === 0) {
      return { ...category, amount, percentage }
    }

    const weights = category.children.map((_, index) => Math.pow(GOLDEN_RATIO, -index))
    const totalWeight = weights.reduce((a, b) => a + b, 0)

    const updatedChildren = category.children.map((child, index) => {
      const childAmount = amount * (weights[index] / totalWeight)
      return distributeInvestmentRecursive(child, childAmount, (childAmount / amount) * 100)
    })

    return { ...category, amount, percentage, children: updatedChildren }
  }

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

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Редактирование портфеля</h2>
      <div className="mb-4">
        <input
          type="number"
          className="p-2 rounded w-full bg-gray-700"
          placeholder="Введите сумму инвестирования"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
        />
        <button onClick={distributeInvestment} className="mt-2 p-2 bg-blue-500 rounded w-full">
          Распределить по золотому сечению
        </button>
      </div>

      <div className="mb-4">
        <select className="p-2 rounded w-full bg-gray-700" onChange={(e) => setSelectedParentId(e.target.value)}>
          <option value="">Выбрать родительскую категорию</option>
          {getAllCategories(portfolio).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="p-2 mt-2 rounded w-full bg-gray-700 disabled:text-gray-400"
          placeholder="Название новой категории"
          value={newCategoryName}
          disabled={!selectedParentId}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          disabled={!selectedParentId || newCategoryName.trim().length === 0}
          onClick={addCategory}
          className="mt-2 p-2 bg-green-500 rounded w-full"
        >
          Добавить категорию
        </button>
      </div>
    </div>
  )
}

export default PortfolioEditor
