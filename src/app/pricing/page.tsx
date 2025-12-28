"use client";

import GameCard from "@/components/GameCard"; // adjust path as needed
import { gameInfo } from "@/data/games";

const Pricing = () => {
    return (
        <>
            <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-screen-lg mx-auto text-center">
                    <h1 className="text-5xl font-heading text-electricBlue mb-10">
                        Pricing Plans
                    </h1>

                    {/* 💳 Pricing Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Basic",
                                price: "$5/month",
                                features: ["1 GB RAM", "10 GB Disk", "Community Support"],
                                popular: false,
                            },
                            {
                                title: "Standard",
                                price: "$10/month",
                                features: ["2 GB RAM", "20 GB Disk", "Priority Support"],
                                popular: true,
                            },
                            {
                                title: "Pro",
                                price: "$20/month",
                                features: ["4 GB RAM", "50 GB Disk", "24/7 Support"],
                                popular: false,
                            },
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`p-6 bg-darkGray rounded-lg shadow-subtle border border-gray-700 ${
                                    plan.popular
                                        ? "border-electricBlue"
                                        : "hover:border-electricBlue"
                                } transition-transform`}
                            >
                                <h2 className="text-2xl font-bold text-electricBlue mb-3">
                                    {plan.title}
                                </h2>
                                <p className="text-xl text-electricBlueLight mb-4">{plan.price}</p>
                                <ul className="text-lightGray space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                {plan.popular && (
                                    <div className="mt-4 text-sm font-bold text-electricBlueLight uppercase">
                                        Most Popular
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 🧩 GameCard Preview Section */}
                    <div className="mt-16 text-center">
                        <h2 className="text-3xl text-white font-bold mb-6">Supported Games Preview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {[
                                "minecraft",
                                "valheim",
                                "rust",
                                "project_zomboid",
                                "terraria",
                                "nonexistent_key", // fallback test
                            ].map((key) => (
                                <GameCard
                                    key={key}
                                    gameKey={key}
                                    serverName={gameInfo[key]?.name || "Unknown Server"}
                                    status="online"
                                />
                            ))}
                        </div>
                    </div>

                    {/* 📄 Terms of Service */}
                    <div className="mt-16 text-sm text-lightGray">
                        <p>
                            By using ZeroLagHub, you agree to comply with our{" "}
                            <a
                                href="/terms-of-service"
                                className="text-electricBlue underline hover:text-electricBlueLight transition"
                            >
                                Terms of Service
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
