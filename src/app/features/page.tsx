


const Features = () => {
    return (
        <>
           
           <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-screen-lg mx-auto text-center">
                    <h1 className="text-5xl font-heading text-electricBlue mb-6">
                        Platform Features
                    </h1>
                    <p className="text-lightGray text-lg mb-10">
                        Discover the powerful features of ZeroLagHub that set us apart.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Blazing Fast Performance",
                                description:
                                    "Our servers are optimized for speed and reliability to give you the best experience.",
                                icon: "🔥",
                            },
                            {
                                title: "Intuitive Dashboard",
                                description:
                                    "Manage your game servers easily with our user-friendly dashboard.",
                                icon: "📊",
                            },
                            {
                                title: "24/7 Support",
                                description:
                                    "Get help anytime with our around-the-clock support team.",
                                icon: "💡",
                            },
                            {
                                title: "Custom Mod Support",
                                description:
                                    "Run modded servers with full customization options tailored to your needs.",
                                icon: "🛠️",
                            },
                            {
                                title: "Scalable Plans",
                                description:
                                    "Choose a plan that grows with your community, from small servers to large-scale environments.",
                                icon: "📈",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-lg bg-darkGray p-6 shadow-subtle transition-shadow hover:shadow-hover-glow"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h2 className="text-electricBlue text-2xl font-bold mb-3">
                                    {feature.title}
                                </h2>
                                <p className="text-lightGray">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
       

            </div>
        </>
    );
};

export default Features;
