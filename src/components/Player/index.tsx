import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../context/PlayerContext'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
  const [progress, setProgress] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    isLooping,
    playNext,
    toggleShufle,
    isShuffling,
    playPrevius,
    setIsPlayingState,
    toggleLoop,
    hasNext,
    hasPrevius
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) return

    console.log(!isPlaying)
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    setProgress(amount)
    audioRef.current.currentTime = amount
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="playing.svg" alt="Tocando agora" />
        {/* <strong>Tocando agora {episode?.title}</strong> */}
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcat para ouvir</strong>
        </div>
      )}

      <footer className={episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
            autoPlay
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
          />
        )}

        <div className={styles.button}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShufle}>
            <img
              src="/shuffle.svg"
              alt="Embaralhar"
              className={isShuffling ? styles.isActive : ''}
            />
          </button>
          <button
            type="button"
            onClick={playPrevius}
            disabled={!episode || !hasPrevius}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={togglePlay}
            className={styles.playButton}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar próxima" />
            ) : (
              <img src="/play.svg" alt="Tocar próxima" />
            )}
          </button>
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" onClick={toggleLoop} disabled={!episode}>
            <img
              src="/repeat.svg"
              alt="Repetir"
              className={isLooping ? styles.isActive : ''}
            />
          </button>
        </div>
      </footer>
    </div>
  )
}
