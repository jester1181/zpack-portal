"use client";



const TermsOfService = () => {
    return (
        <>
           
           <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-5xl font-heading text-electricBlue mb-10">
                        Terms of Service
                    </h1>
                    <div className="space-y-6 text-lightGray">
                        <p>
                            <strong>Effective Date:</strong> [Insert Date]
                        </p>
                        <p>
                            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of 
                            ZeroLagHub&rsquo;s website, services, and hosting platform. By using our 
                            services, you agree to these Terms. Please read them carefully.
                        </p>
                        <h2 className="text-3xl text-electricBlue mt-8">1. Definitions</h2>
                        <p>
                            - &ldquo;Service&rdquo; refers to game server hosting and related 
                            products provided by ZeroLagHub.
                            <br />
                            - &ldquo;User&rdquo; refers to anyone accessing or using the Service.
                            <br />
                            - &ldquo;Account&rdquo; refers to a registered profile created by the User.
                        </p>
                        <h2 className="text-3xl text-electricBlue mt-8">2. Acceptable Use</h2>
                        <p>
                            You agree to:
                            <br />
                            - Not use our Service for illegal activities, harassment, or abusive behavior.
                            <br />
                            - Not overuse or abuse resources, disrupting service for others.
                        </p>
                        <h2 className="text-3xl text-electricBlue mt-8">3. Account Responsibilities</h2>
                        <p>
                            - Maintain the confidentiality of your login credentials.
                            <br />
                            - Ensure all account information is accurate and up-to-date.
                        </p>
                        <h2 className="text-3xl text-electricBlue mt-8">4. Payments and Refunds</h2>
                        <p>
                            - Subscriptions are billed monthly.
                            <br />
                            - Refunds are not provided for partial periods or mid-cycle 
                            cancellations unless explicitly stated in a promotion.
                        </p>
                        <h2 className="text-3xl text-electricBlue mt-8">5. Service Availability</h2>
                        <p>
                            - We strive for 99.9% uptime but do not guarantee uninterrupted service.
                            <br />
                            - Downtime caused by third-party providers or scheduled maintenance 
                            is not our liability.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
