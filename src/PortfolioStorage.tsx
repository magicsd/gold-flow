import { PortfolioItem } from './types'

type Props = {
  portfolio: PortfolioItem[]
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>
}

const PortfolioStorage = ({ portfolio, setPortfolio }: Props) => {
  const saveToFile = () => {
    const fileData = JSON.stringify(portfolio, null, 2)
    const blob = new Blob([fileData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'portfolio.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        setPortfolio(data)
      } catch (error) {
        console.error('Ошибка загрузки файла:', error)
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Сохранение/Загрузка</h2>
      <div className="flex gap-2">
        <button onClick={saveToFile} className="p-2 bg-blue-500 rounded w-full">
          💾 Сохранить
        </button>
        <label className="p-2 bg-green-500 rounded w-full text-center cursor-pointer">
          📂 Загрузить
          <input type="file" accept=".json" className="hidden" onChange={loadFromFile} />
        </label>
      </div>
    </div>
  )
}

export default PortfolioStorage
