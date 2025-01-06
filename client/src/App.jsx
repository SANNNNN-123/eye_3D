// App.jsx
import React from 'react'
import EyeCanvas from './components/EyeCanvas'
import ModelViewer from './components/ModelViewer';

function App() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-teal-800">
      <div className="w-full h-full flex flex-col">
        <h1 className="text-3xl font-bold text-white p-4 text-center bg-gray-900 bg-opacity-90">3D Eye Model</h1>
        <div className="flex-1">
          <EyeCanvas/>
        </div>
      </div>
    </div>
  )
}

export default App