import { useState } from 'react'
import { PortfolioItem } from '../types'
import { FaChevronUp, FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa'

type Props = {
  portfolio: PortfolioItem[]
  renameCategory: (id: string, newName: string) => void
  moveCategory: (parentId: string | null, categoryId: string, direction: 'up' | 'down') => void
  deleteCategory: (id: string) => void
}

const PortfolioView: React.FC<Props> = ({ portfolio, renameCategory, moveCategory, deleteCategory }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <h2 className="text-2xl font-semibold mb-4">Структура портфеля</h2>
    {portfolio.map((category, index) => (
      <PortfolioCategory
        deleteCategory={deleteCategory}
        key={category.id}
        category={category}
        depth={0}
        index={index}
        parentId={null}
        renameCategory={renameCategory}
        moveCategory={moveCategory}
      />
    ))}
  </div>
)

const PortfolioCategory: React.FC<{
  category: PortfolioItem
  depth: number
  index: number
  parentId: string | null
  renameCategory: (id: string, newName: string) => void
  moveCategory: (parentId: string | null, categoryId: string, direction: 'up' | 'down') => void
  deleteCategory: (id: string) => void
}> = ({ category, depth, index, parentId, renameCategory, moveCategory, deleteCategory }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(category.name)
  const [isExpanded, setIsExpanded] = useState(true) // Контроль отображения вложенных категорий

  const handleRename = () => {
    if (newName.trim()) renameCategory(category.id, newName.trim())
    setIsEditing(false)
  }

  return (
    <div className="relative flex flex-col group transition-opacity duration-300">
      {/* Линия вложенности */}
      {depth > 0 && <div className="absolute left-[-8px] top-0 bottom-0 w-[2px] bg-blue-500"></div>}

      <div className="flex items-center space-x-2 py-1 hover:bg-gray-700 rounded-md px-2 transition duration-200">
        {/* Кнопка раскрытия вложенных категорий */}
        {category.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-yellow-400 transition duration-200"
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        )}

        {/* Название категории */}
        <div className="flex items-center space-x-2 min-w-[150px]">
          {isEditing ? (
            <input
              type="text"
              className="bg-gray-700 text-white p-1 rounded w-[150px] text-sm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
            />
          ) : (
            <p
              className="font-semibold cursor-pointer hover:text-yellow-400 text-sm"
              onDoubleClick={() => setIsEditing(true)}
            >
              {category.name} -<span className="text-green-400"> ${category.amount.toFixed(2)}</span>
              <span className="text-gray-400 ml-2">({category.percentage?.toFixed(2)}%)</span>
            </p>
          )}
        </div>

        {/* Кнопки управления (показываются только при наведении) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
          <button
            className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs"
            onClick={() => moveCategory(parentId, category.id, 'up')}
            disabled={index === 0}
          >
            <FaChevronUp />
          </button>

          <button
            className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs"
            onClick={() => moveCategory(parentId, category.id, 'down')}
          >
            <FaChevronDown />
          </button>

          {/* Кнопка редактирования */}
          <button className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs" onClick={() => setIsEditing(true)}>
            <FaEdit />
          </button>

          {/* Кнопка удаления */}
          <button
            className="p-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            onClick={() => deleteCategory(category.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Вложенные категории (скрываются по нажатию) */}
      {isExpanded && (
        <div className="ml-4">
          {category.children.map((child, childIndex) => (
            <PortfolioCategory
              key={child.id}
              category={child}
              depth={depth + 1}
              index={childIndex}
              parentId={category.id}
              renameCategory={renameCategory}
              moveCategory={moveCategory}
              deleteCategory={deleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PortfolioView
