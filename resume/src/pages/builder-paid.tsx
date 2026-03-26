import type { NextPage } from 'next';
import Head from 'next/head';
import BuilderLayout from '@/modules/builder/BuilderLayout';
import { withBasePath } from '@/utils/withBasePath';

const BuilderPaidPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Riseflake Resume Builder - Paid</title>
        <meta name="description" content="Single Page Resume Builder - Paid" />
        <link rel="icon" type="image/png" href={withBasePath('/hero.jpg')} />
      </Head>

      <BuilderLayout mode="paid" />
    </div>
  );
};

export default BuilderPaidPage;
