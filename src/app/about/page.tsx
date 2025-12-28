const About = () => {
    return (
        <>
            
            <div className="min-h-screen bg-gradient-to-br from-black to-darkGray text-foreground flex flex-col items-center justify-center px-4">
                <div className="max-w-3xl text-center">
                    <h1 className="text-4xl font-heading text-electricBlue mb-5">
                        About ZeroLagHub
                    </h1>
                    <p className="text-lg text-lightGray leading-relaxed mb-6">
                        ZeroLagHub is your ultimate solution for hosting open-source, indie, RPG,
                        and modded game servers. We focus on providing seamless, reliable, and
                        high-performance server hosting for gamers and developers alike.
                    </p>
                    <p className="text-lg text-lightGray leading-relaxed">
                        Our platform is built with cutting-edge automation, robust server management
                        capabilities, and an easy-to-use interface to ensure you can focus on
                        playing or developing while we handle the rest.
                    </p>
                </div>
               
            </div>
            
        </>
    );
};

export default About;
