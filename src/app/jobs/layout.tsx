import React from "react";
import Head from "next/head";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Find Jobs | RiseFlake</title>
        <meta name="description" content="Browse the latest job openings on RiseFlake. Find your next career opportunity today!" />
        <link rel="canonical" href="https://riseflake.com/jobs" />
        <meta property="og:title" content="Find Jobs | RiseFlake" />
        <meta property="og:description" content="Browse the latest job openings on RiseFlake. Find your next career opportunity today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riseflake.com/jobs" />
        <meta property="og:site_name" content="RiseFlake" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find Jobs | RiseFlake" />
        <meta name="twitter:description" content="Browse the latest job openings on RiseFlake. Find your next career opportunity today!" />
      </Head>
      <main>{children}</main>
    </>
  );
}
