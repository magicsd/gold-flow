import { PortfolioItem } from '../types'

type Props = {
  investmentAmount: number
  setInvestmentAmount: (value: number) => void
  newCategoryName: string
  setNewCategoryName: (value: string) => void
  selectedParentId: string | null
  setSelectedParentId: (value: string | null) => void
  addCategory: () => void
  distributeInvestment: () => void
  portfolio: PortfolioItem[]
  getAllCategories: (items: PortfolioItem[], depth?: number) => { id: string; name: string }[]
}

const PortfolioEditor: React.FC<Props> = ({
  investmentAmount,
  setInvestmentAmount,
  newCategoryName,
  setNewCategoryName,
  selectedParentId,
  setSelectedParentId,
  addCategory,
  distributeInvestment,
  portfolio,
  getAllCategories,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Редактирование портфеля</h2>

      {/* Ввод суммы инвестирования */}
      <div className="mb-4">
        <label className="block text-gray-400">Сумма инвестирования:</label>
        <input
          type="number"
          className="p-2 rounded w-full bg-gray-700 text-white"
          placeholder="Введите сумму"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
        />
        <button onClick={distributeInvestment} className="mt-2 p-2 bg-blue-500 rounded w-full">
          Распределить по золотому сечению
        </button>
      </div>

      {/* Добавление новой категории */}
      <div className="mb-4">
        <label className="block text-gray-400">Название новой категории:</label>
        <input
          type="text"
          className="p-2 rounded w-full bg-gray-700 text-white"
          placeholder="Введите название"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </div>

      {/* Выбор родительской категории */}
      <div className="mb-4">
        <label className="block text-gray-400">Выбрать родительскую категорию:</label>
        <select
          className="p-2 rounded w-full bg-gray-700 text-white"
          value={selectedParentId || ''}
          onChange={(e) => setSelectedParentId(e.target.value)}
        >
          <option value="">— Без родителя (корневая категория) —</option>
          {getAllCategories(portfolio).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={addCategory} className="p-2 bg-green-500 rounded w-full">
        Добавить категорию
      </button>
    </div>
  )
}

export default PortfolioEditor
