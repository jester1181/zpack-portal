// src/components/Footer.tsx

export default function Footer() {
  return (
      <footer className="bg-darkGray text-center text-gray-500 py-6">
          © {new Date().getFullYear()} ZeroLagHub. All rights reserved.
          <br />
          <a href="/terms-of-service" className="text-electricBlue underline hover:text-neonGreen">
              Terms of Service
          </a>{" "}
          |{" "}
          <a href="/privacy-policy" className="text-electricBlue underline hover:text-neonGreen">
              Privacy Policy
          </a>
      </footer>
  );
}
