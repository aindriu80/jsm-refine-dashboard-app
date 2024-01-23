import { Refine, GitHubBanner, WelcomePage } from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import { useNotificationProvider } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import dataProvider, {
  GraphQLClient,
  liveProvider,
} from '@refinedev/nestjs-query'
import { createClient } from 'graphql-ws'
import { App as AntdApp } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routerBindings, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6'
import { useTranslation } from 'react-i18next'
const API_URL = 'https://api.nestjs-query.refine.dev/graphql'
const WS_URL = 'wss://api.nestjs-query.refine.dev/graphql'

const gqlClient = new GraphQLClient(API_URL)
const wsClient = createClient({ url: WS_URL })

function App() {
  const { t, i18n } = useTranslation()

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider(gqlClient)}
              liveProvider={liveProvider(wsClient)}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: 'aYMXxT-gdGW3p-b0PGdK',
                liveMode: 'auto',
              }}>
              <Routes>
                <Route index element={<WelcomePage />} />
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
