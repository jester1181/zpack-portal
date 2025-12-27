"use client";



import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-transparent px-6 py-10">

            <header className="relative flex-grow flex flex-col items-center justify-center text-center px-6 py-20 bg-cover bg-center">
                
                <div className="relative z-10 flex flex-col items-center">
                    <Image
                        src="/images/zlhlogo_enlarged.png"
                        alt="ZeroLagHub Logo"
                        width={140}
                        height={140}
                        className="mb-6"
                    />
                    <h1 className="text-5xl md:text-6xl font-heading text-electricBlue mb-6">
                        Next-Level Game Hosting
                    </h1>
                    <p className="text-lg md:text-xl text-lightGray mb-8 max-w-2xl">
                        Optimized servers for open-source, indie, RPG, and modded games.
                        Experience unparalleled speed, scalability, and reliability.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="/register"
                            className="px-8 py-4 bg-electricBlue text-black font-bold text-lg rounded-lg hover:bg-neonGreen transition transform hover:scale-105 shadow-md"
                        >
                            Get Started
                        </a>
                        <a
                            href="/features"
                            className="px-8 py-4 border border-electricBlue text-electricBlue font-bold text-lg rounded-lg hover:bg-electricBlue hover:text-black transition transform hover:scale-105"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </header>
            
        </div>
    );
}
