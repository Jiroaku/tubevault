/* @refresh reload */
import { render } from 'solid-js/web'

import './styles/index.css'
import './styles/youtube-minimal.css'
import App from './App'

const root = document.getElementById('root')

render(() => <App />, root!)