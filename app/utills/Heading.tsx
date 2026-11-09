import React, { FC } from 'react'

interface HeadingProps {
    title: string
    description: string
    keywords: string
}

const Heading:FC<HeadingProps> = ({title, description, keywords}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="icon" href="/favicon.ico" />
      <link rel="android-chrome-192x192" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="android-chrome-512x512" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="favicon-16x16" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="favicon-32x32" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </>
  );
}

export default Heading