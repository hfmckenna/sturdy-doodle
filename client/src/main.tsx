import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './index.css'
import App from './App.tsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
