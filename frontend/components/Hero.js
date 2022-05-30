import Image from "next/image";
import Navbar from "./Navbar";
import Link from "next/link";
import Footer from "./Footer";
const Hero = () => {
	return (
		<section className='min-h-screen flex flex-col justify-between'>
			<Navbar />
			<section className='font-mont   text-gray-300 body-font'>
				<div className='container mx-auto   flex lg:px-5 py-24 md:flex-row flex-col items-center'>
					<div className='w-full  lg:pl-24 lg:flex-grow  flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center'>
						<h1 className='xl:text-8xl text-6xl mb-4 font-medium text-white  w-full'>
							<span className='font-bebas text-transparent bg-clip-text bg-gradient-to-b from-secondary-color to-pink-700'>
								Decentralized <br />
							</span>{" "}
							<span className='font-bebas text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
								Betting Buddy
							</span>
						</h1>
						<p className=' text-xl mb-8 leading-relaxed lg:pr-32 font-medium'>
							If you want to bet in the World of Web 3, SafeBet is
							your finest option. A dApp that will assist you in
							betting on the things that thrill you the most!
						</p>
						<div className='flex justify-center'>
							<Link href='/Dashboard'>
								<a target='_blank'>
									<button className='inline-flex text-white bg-secondary-color shadow-md shadow-glow border-2 py-2 px-8 border-secondary-color focus:outline-none rounded text-lg transition-all duration-500 ease-in-out hover:scale-90'>
										Bet Now!
									</button>
								</a>
							</Link>
							<Link href='/About'>
								<a className='ml-4 inline-flex text-white border-2 border-white py-2 px-6 focus:outline-none  rounded text-lg transition-all duration-500 ease-in-out hover:scale-90'>
									Learn More
								</a>
							</Link>
						</div>
					</div>
					<div className='w-full flex flex-col justify-center items-center'>
						<Image
							className='object-cover object-center rounded'
							width={500}
							height={500}
							alt='hero'
							src='/hero_image.png'
						/>
					</div>
				</div>
			</section>
			<Footer />
		</section>
	);
};

export default Hero;
