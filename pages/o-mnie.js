import Layout from '../components/layout';

export default function About() {
  return (
    <Layout>
      <h2>O mnie</h2>
      <section>
        <p>Cześć, jestem Maciek!</p>
        <p>
          Na co dzień zajmuję się tworzeniem aplikacji internetowych dla dużych firm.{' '}
          W wolnym czasie biegam, jeżdżę na longboardzie, czytam książki lub słucham podcastów.
        </p>
        <p>
          Ta strona istnieje dzięki malinom zasilanym energią elektryczną.{' '}
          Zbudujesz podobną krok po kroku z{' '}
          <a href="https://nextjs.org/learn" target="_blank">samouczkiem Next.js</a>.
        </p>
      </section>
    </Layout>
  );
}
