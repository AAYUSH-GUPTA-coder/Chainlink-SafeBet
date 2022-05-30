import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/solid";

const Navbar = ({
	option1 = "What is SafeBet?",
	link1 = "/About",
	option2 = "Meet The Team",
	link2 = "/Team",
	option3,
	link3,
}) => {
	const router = useRouter();

	return (
		<header className='font-mont text-gray-400 bg-transparent body-font'>
			<div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
				<Link href='/'>
					<a className='flex title-font font-medium items-center text-white mb-4 md:mb-0'>
						<Image
							className='object-cover object-center rounded'
							width={40}
							height={30}
							alt='hero'
							src='/logo.svg'></Image>

						<span className='ml-3 text-2xl tracking-widest font-bebas cursor-pointer'>
							SafeBet
						</span>
					</a>
				</Link>
				<nav className='font-semibold md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center cursor-pointer'>
					{option3 && link3 ? (
						<Link href={link3}>
							<a className='mr-5 hover:text-secondary-color'>
								{option3}
							</a>
						</Link>
					) : (
						""
					)}
					<Link href={link1}>
						<a className='mr-5 hover:text-secondary-color'>
							{option1}
						</a>
					</Link>
					<Link href={link2}>
						<a className='mr-5 hover:text-secondary-color'>
							{option2}
						</a>
					</Link>
				</nav>
				{router.pathname !== "/Dashboard" ? (
					<Link href='/Dashboard'>
						<a target='_blank'>
							<button className='font-bold inline-flex text-white items-center bg-gradient-to-l from-tertiary-color to-secondary-color  border-0 py-2 px-6 focus:outline-none rounded text-base mt-4 md:mt-0 transition duration-500 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110'>
								Dashboard{" "}
								<ArrowRightIcon className='w-4 h-4 ml-1' />
								{/* <svg
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='w-4 h-4 ml-1'
								viewBox='0 0 24 24'>
								<path d='M5 12h14M12 5l7 7-7 7'></path>
							</svg> */}
							</button>
						</a>
					</Link>
				) : (
					<Link href='/Dashboard'>
						<a>
							<button
								disabled
								className='font-bold inline-flex text-white items-center bg-gradient-to-l from-tertiary-color to-secondary-color  border-0 py-2 px-6 focus:outline-none rounded text-base mt-4 md:mt-0'>
								Dashboard{" "}
								<ArrowDownIcon className='w-4 h-4 ml-1' />
							</button>
						</a>
					</Link>
				)}
			</div>
		</header>
	);
};

export default Navbar;
