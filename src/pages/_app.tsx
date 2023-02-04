import { type AppType } from 'next/app'
import 'react-toastify/dist/ReactToastify.min.css'

import { api } from '@/lib/api'

import '../styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default api.withTRPC(MyApp)
