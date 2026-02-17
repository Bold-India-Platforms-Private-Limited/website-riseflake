import React from "react";
import Head from "next/head";

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Find Internships | RiseFlake</title>
        <meta name="description" content="Browse the latest internship openings on RiseFlake. Find your next opportunity today!" />
        <link rel="canonical" href="https://riseflake.com/internships" />
        <meta property="og:title" content="Find Internships | RiseFlake" />
        <meta property="og:description" content="Browse the latest internship openings on RiseFlake. Find your next opportunity today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riseflake.com/internships" />
        <meta property="og:site_name" content="RiseFlake" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find Internships | RiseFlake" />
        <meta name="twitter:description" content="Browse the latest internship openings on RiseFlake. Find your next opportunity today!" />
      </Head>
      <main>{children}</main>
    </>
  );
}
