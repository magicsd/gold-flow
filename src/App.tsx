import { useState } from 'react'
import PortfolioEditor from './PortfolioEditor'
import PortfolioView from './PortfolioView'
import { PortfolioItem } from './types'
import PortfolioStorage from './PortfolioStorage.tsx'

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: '2', name: 'Преумножение', amount: 0, children: [] },
    { id: '1', name: 'Сохранение', amount: 0, children: [] },
  ])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6">💰 Investment Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioEditor portfolio={portfolio} setPortfolio={setPortfolio} />
        <PortfolioView portfolio={portfolio} />
      </div>
      <PortfolioStorage portfolio={portfolio} setPortfolio={setPortfolio} />
    </div>
  )
}

export default App
