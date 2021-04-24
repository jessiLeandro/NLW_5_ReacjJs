import '../styles/global.scss'

import { Hearder } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContext } from '../context/PlayerContext'

import styles from '../styles/app.module.scss'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(!state)
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setIsPlayingState
      }}>
      <div className={styles.wrapper}>
        <main>
          <Hearder />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
