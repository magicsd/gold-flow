import { useState, useEffect } from 'react'
import { PortfolioItem } from '../types'
import { FaChevronUp, FaChevronDown, FaEdit, FaTrash } from 'react-icons/fa'

const PortfolioCategory: React.FC<{
  category: PortfolioItem
  depth: number
  index: number
  parent?: PortfolioItem | null
  renameCategory: (id: string, newName: string) => void
  moveCategory: (parentId: string | null, categoryId: string, direction: 'up' | 'down') => void
  deleteCategory: (id: string) => void
  updatePortfolio: VoidFunction
}> = ({ category, depth, index, parent, renameCategory, moveCategory, deleteCategory, updatePortfolio }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(category.name)
  const [isExpanded, setIsExpanded] = useState(true) // Контроль отображения вложенных категорий

  // Пересчет портфеля при изменении вложенных элементов
  useEffect(() => {
    updatePortfolio()
  }, [category.children.length]) // Следим за изменениями в подкатегориях

  const handleRename = () => {
    if (newName.trim()) renameCategory(category.id, newName.trim())
    setIsEditing(false)
  }

  // Определяем, является ли текущий элемент первым или последним в родительской категории
  const isFirst = index === 0
  const isLast = parent ? index === parent.children.length - 1 : false

  return (
    <div className="relative flex flex-col">
      {/* Линия вложенности */}
      {depth > 0 && <div className="absolute left-[-8px] top-0 bottom-0 w-[2px] bg-blue-500"></div>}

      <div className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-700 rounded-md transition duration-200 group">
        {/* Кнопка раскрытия вложенных категорий */}
        {category.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-yellow-400 transition duration-200"
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        )}

        {/* Название категории (фикс прыжков при редактировании) */}
        <div className="flex items-center space-x-2 min-w-[180px]">
          {isEditing ? (
            <input
              type="text"
              className="bg-gray-700 text-white px-1 rounded w-[180px] text-sm"
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

        {/* Кнопки управления (показываются только при ховере строки) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
          {/* Кнопка "вверх" - скрывается, если категория уже первая */}
          <button
            className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => moveCategory(parent?.id || null, category.id, 'up')}
            disabled={isFirst}
          >
            <FaChevronUp />
          </button>

          {/* Кнопка "вниз" - скрывается, если категория уже последняя */}
          <button
            className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => moveCategory(parent?.id || null, category.id, 'down')}
            disabled={isLast}
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
              parent={category} // Передаем текущий элемент как родителя
              renameCategory={renameCategory}
              moveCategory={moveCategory}
              deleteCategory={deleteCategory}
              updatePortfolio={updatePortfolio} // Прокидываем пересчет дальше
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PortfolioCategory
