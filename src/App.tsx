import { usePortfolio } from './hooks/usePortfolio'
import PortfolioEditor from './components/PortfolioEditor'
import PortfolioView from './components/PortfolioView'
import PortfolioStorage from './components/PortfolioStorage'

const App: React.FC = () => {
  const portfolioState = usePortfolio()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6">💰 Investment Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioEditor {...portfolioState} />
        <PortfolioView
          updatePortfolio={portfolioState.updatePortfolio}
          portfolio={portfolioState.portfolio}
          moveCategory={portfolioState.moveCategory}
          renameCategory={portfolioState.renameCategory}
          deleteCategory={portfolioState.deleteCategory}
        />
      </div>
      <PortfolioStorage portfolio={portfolioState.portfolio} setPortfolio={portfolioState.setPortfolio} />
    </div>
  )
}

export default App
