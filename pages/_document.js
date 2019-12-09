import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document';

export default class extends Document {
    render() {
        return (
            <html lang="pt-br">
                <Head>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}