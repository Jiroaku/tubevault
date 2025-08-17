import { Router, Route } from '@solidjs/router'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import UsersPage from './components/UsersPage'
import OldestVideosPage from './components/OldestVideosPage'
import DocsPage from './components/DocsPage'
import NotFoundPage from './components/NotFoundPage'

function App() {
  return (
    <Router>
      <Route path="/" component={() => <Layout><HomePage /></Layout>} />
      <Route path="/users" component={() => <Layout><UsersPage /></Layout>} />
      <Route path="/user/:username" component={() => <Layout><UsersPage /></Layout>} />
      <Route path="/videos" component={() => <Layout><OldestVideosPage /></Layout>} />
      <Route path="/t/:article" component={() => <Layout><DocsPage /></Layout>} />
      <Route path="/*all" component={NotFoundPage} />
    </Router>
  )
}

export default App