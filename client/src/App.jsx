// App.jsx
import React from 'react'
import EyeCanvas from './components/EyeCanvas'

function App() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-teal-800">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center bg-gray-900 bg-opacity-90 py-3 px-6">
          <div className="flex gap-4">
            <button className="text-white hover:text-blue-400 transition-colors px-4 py-1.5 rounded-lg bg-gray-800">
              Home
            </button>
            <button className="text-white hover:text-blue-400 transition-colors px-4 py-1.5 rounded-lg bg-gray-800">
              Optom Gallery
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white flex-1 text-center">3D Eye Model</h1>
        </div>
        <div className="flex-1">
          <EyeCanvas/>
        </div>
      </div>
    </div>
  )
}

export default App