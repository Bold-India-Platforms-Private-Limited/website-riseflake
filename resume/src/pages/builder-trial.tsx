import type { NextPage } from 'next';
import Head from 'next/head';
import BuilderLayout from '@/modules/builder/BuilderLayout';

const BuilderTrialPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Riseflake Resume Builder - Trial</title>
        <meta name="description" content="Single Page Resume Builder - Trial" />
        <link rel="icon" type="image/png" href="hero.jpg" />
      </Head>

      <BuilderLayout mode="trial" />
    </div>
  );
};

export default BuilderTrialPage;
