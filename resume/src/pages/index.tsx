import Head from 'next/head';
import HomeLayout from '@/modules/home/HomeLayout';

function HomePage() {
  return (
    <div>
      <Head>
        <title>Riseflake Resume : Home</title>
        <meta name="description" content="Single Page Resume Builder" />
        <link rel="icon" type="image/png" href="/hero.jpg" />
      </Head>

      <HomeLayout />
    </div>
  );
}

export default HomePage;
