// pages/_app.js
import React from "react";
import App from "next/app";
import Layout from "../components/layout/layout";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout>
        <Component {...pageProps} />
        <style global jsx>{`
        body {
          margin: 0;
        }
      `}</style>
      </Layout>
    )
  }
}

export default MyApp;
