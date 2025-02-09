import { PortfolioItem } from './types'

type Props = {
  portfolio: PortfolioItem[]
}

const PortfolioView: React.FC<Props> = ({ portfolio }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Структура портфеля</h2>
      {portfolio.map((category) => (
        <PortfolioCategory key={category.id} category={category} depth={0} />
      ))}
    </div>
  )
}

const PortfolioCategory: React.FC<{ category: PortfolioItem; depth: number }> = ({ category, depth }) => {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div className="border-l-4 pl-4 mb-2 border-blue-500">
        <p className="font-semibold">
          {category.name} -<span className="text-green-400"> ${category.amount.toFixed(2)}</span>
          <span className="text-gray-400 ml-2">({category.percentage?.toFixed(2)}%)</span>
        </p>
      </div>
      {category.children.map((child) => (
        <PortfolioCategory key={child.id} category={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export default PortfolioView
