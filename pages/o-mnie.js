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
          Ta strona jest skutkiem ubocznym poszukiwań technologii, która pozwalałaby{' '}
          wygodnie tworzyć lekkie i szybkie strony internetowe. Początkowo chciałem{' '}
          przechowywać bloga w bazie danych, tak jak robi to WordPress, ale ostatecznie{' '}
          spodobał mi się Next.js i pisanie do plików tekstowych w formacie markdown.{' '}
        </p>
        <p>
          Jeśli podoba Ci się moja strona, możesz zbudować podobną krok po kroku z{' '}
          <a href="https://nextjs.org/learn" target="_blank">samouczkiem Next.js</a>.
        </p>
      </section>
    </Layout>
  );
}
