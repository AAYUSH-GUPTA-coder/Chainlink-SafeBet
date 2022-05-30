import Head from "next/head";
import Hero from "../components/Hero";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Safe Bet</title>
                <meta
                    name='description'
                    content='SafeBet is the best Betting dApp. Completely decentralized and powered by TRUTH, not Trust!'
                />
                <meta name='msapplication-TileColor' content='#da532c' />
                <meta name='theme-color' content='#ffffff' />
            </Head>

            <main className='bg-gradient-to-br from-tertiary-color via-main to-tertiary-color'>
                <Hero />
            </main>
        </div>
    );
}
