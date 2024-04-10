import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppContextProvider } from './contexts/AppContext.tsx'

// If there is an error then the react query will do a retry.
//There pros of this is that if the server is dying slowly then the server will come up by itself.
//THe cons of retrying without any delay is that it does not gives the server any time to recover
//and that can make the situtation more worse. Byt setting the retry 0 we disable the retry.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  }
})
ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
