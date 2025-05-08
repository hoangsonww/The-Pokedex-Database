import Document, { Html, Head, Main, NextScript } from 'next/document';

// Here I added Poppins font from Google Fonts
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-lightBg dark:bg-darkBg text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
