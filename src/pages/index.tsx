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
export default function Home(props) {
  return <p>{JSON.stringify(props.episodes)}</p>
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  }
}
