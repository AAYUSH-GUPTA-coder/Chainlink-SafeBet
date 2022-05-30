import Head from "next/head";
import Footer from "../components/Footer";

import Team from "../components/Team";

export default function TeamPage() {
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
				<Team />
			</main>
		</div>
	);
}
