import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[]
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  currentEpisodeIndex: number
  play: (episode: Episode) => void
  playList: (episode: Episode[], index: number) => void
  togglePlay()
  toggleShufle()
  toggleLoop()
  playNext: () => void
  playPrevius: () => void
  hasNext: boolean
  hasPrevius: boolean
  setIsPlayingState: (state: boolean) => void
  clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({
  children
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShufle() {
    setIsShuffling(!isShuffling)
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasPrevius = currentEpisodeIndex > 0
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

  function playNext() {
    if (isShuffling) {
    } else if (hasPrevius) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevius() {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider
      value={{
        clearPlayerState,
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleShufle,
        toggleLoop,
        playNext,
        playPrevius,
        hasNext,
        hasPrevius,
        setIsPlayingState
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
