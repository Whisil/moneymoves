"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Handle the submission here (e.g., send to API)
    console.log("Email submitted:", email);
    setSuccess(true);
    setEmail("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-8">
      {/* Header with Logo */}
      <header className="w-full flex justify-center pt-4 pb-8">
        <Image
          src="/images/moneymoves-logo.png"
          alt="Money Moves Logo"
          width={240}
          height={96}
          className="object-contain"
          priority
        />
      </header>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Free Finance World Newsletter
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 text-center mb-12">
          fresh money news = fresh money moves
        </p>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full  px-6 py-4 bg-white text-black rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm">Successfully subscribed!</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-white text-black rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>

      {/* Footer with YouTube link */}
      <footer className="mt-8">
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      </footer>
    </main>
  );
}
