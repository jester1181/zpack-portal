

const FAQ = () => {
    return (
        <>
            
            <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-heading text-electricBlue mb-6 text-center">
                        Frequently Asked Questions
                    </h1>
                    <div className="space-y-8">
                        <div className="border-b border-gray-600 pb-4">
                            <h2 className="text-2xl font-bold text-foreground mb-2">What is ZeroLagHub?</h2>
                            <p className="text-lightGray text-lg leading-relaxed">
                                ZeroLagHub is a hosting platform specializing in open-source,
                                indie, RPG, and modded game servers.
                            </p>
                        </div>
                        <div className="border-b border-gray-600 pb-4">
                            <h2 className="text-2xl font-bold text-foreground mb-2">What games are supported?</h2>
                            <p className="text-lightGray text-lg leading-relaxed">
                                We support a wide variety of games, including Minecraft, ARK: Survival Evolved,
                                CS:GO, and more. Custom games can also be hosted upon request.
                            </p>
                        </div>
                        <div className="border-b border-gray-600 pb-4">
                            <h2 className="text-2xl font-bold text-foreground mb-2">How do I create a server?</h2>
                            <p className="text-lightGray text-lg leading-relaxed">
                                Once registered, you can create a server directly from your dashboard.
                                Choose your game, allocate resources, and start playing!
                            </p>
                        </div>
                    </div>
                </div>
        

            </div>
        </>
    );
};

export default FAQ;
