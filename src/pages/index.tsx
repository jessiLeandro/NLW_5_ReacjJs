/* eslint-disable camelcase */
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

type Episode = {
  id: string
  title: string
  members: string
  published_at: string
  thumbnail: string
  publishedAt: string
  duration: number
  durationAsString: string
  url: string
}

type HomeProps = {
  latesEpisodes: Episode[]
  allEpisodes: Episode[]

  // episodes: Episode[]
  // episodes: Array<Episode>
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos episódios</h2>

        <ul>
          {latesEpisodes.map((episode) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodesDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => play(episode)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table>
          <thead>
            <tr>
              <th />
              <th>Podcast</th>
              <th>Integrates</th>
              <th>Data</th>
              <th>Duração</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => play(episode)}>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _order: 'desc',
      _sort: 'published_at'
    }
  })

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url
    }
  })

  const latesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latesEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}

/**
 * SPA
 * useEffect(() => {
 *  fecth('http://localhost:3333/episodes')
 *    .then(resp => resp.json())
 *    .then(data => console.log(data))
 * }, [])
 */

/**
 *SSR
 *   export async function getServerSideProps() {
 *     const response = await fetch('http://localhost:3333/episodes')
 *     const data = await response.json()
 *
 *     return {
 *       props: {
 *         episodes: data
 *       }
 *     }
 *   }
 */

/**
 *SSG
 *   export async function getStaticProps() {
 *     const response = await fetch('http://localhost:3333/episodes')
 *     const data = await response.json()
 *
 *     return {
 *       props: {
 *         episodes: data
 *       },
 *       revalidate: XXXX [segundos]
 *     }
 *   }
 */
