import { PortfolioItem } from '../types'
import PortfolioCategory from './PortfolioCategory.tsx'

type Props = {
  portfolio: PortfolioItem[]
  renameCategory: (id: string, newName: string) => void
  moveCategory: (parentId: string | null, categoryId: string, direction: 'up' | 'down') => void
  deleteCategory: (id: string) => void
  updatePortfolio: () => void
}

const PortfolioView: React.FC<Props> = ({
  portfolio,
  renameCategory,
  moveCategory,
  deleteCategory,
  updatePortfolio,
}) => (
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
        updatePortfolio={updatePortfolio}
      />
    ))}
  </div>
)

export default PortfolioView
