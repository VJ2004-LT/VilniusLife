import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { worker } from './mocks/browser'
//await worker.start()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
