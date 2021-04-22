import '../styles/global.scss'

import { Hearder } from '../components/Header'
import { Player } from '../components/Player'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Hearder />
        <Component {...pageProps} />
      </main>

      <Player />
    </div>
  )
}

export default MyApp
