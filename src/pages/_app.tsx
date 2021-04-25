import '../styles/global.scss'

import { Hearder } from '../components/Header'
import { Player } from '../components/Player'

import styles from '../styles/app.module.scss'
import { PlayerContextProvider } from '../context/PlayerContext'

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Hearder />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
