const InfoSection = () => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-2">
        📊 GoldFlow – умное управление инвестициями
      </h2>
      <p className="text-gray-300 mb-4">
        <strong>GoldFlow</strong> помогает инвесторам <strong>структурировать портфель</strong> по принципу{' '}
        <strong>золотого сечения (61.8%)</strong>. Этот математический закон используется в природе, искусстве и теперь
        – в финансах!
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4">
        <li>
          📈 <strong>Автоматически распределяет капитал</strong> между активами
        </li>
        <li>
          ⚖️ <strong>Создает сбалансированную структуру портфеля</strong>
        </li>
        <li>
          🔍 <strong>Использует научный подход</strong> к распределению инвестиций
        </li>
        <li>
          🎯 <strong>Простой и удобный интерфейс</strong> для управления капиталом
        </li>
      </ul>
      <p className="text-green-400">
        💡 <strong>Инвестируй по законам природы – управляй капиталом осознанно!</strong>
      </p>
    </div>
  )
}

export default InfoSection
