"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();
  
  return (
    <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-500">
          FanTune
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-300 hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Testimonials
          </Link>
        </nav>
        <div className="hidden md:block">
          {session?.data?.user ? (
            <Button
              onClick={() => signOut()}
              className="mr-2 bg-gradient-to-tr from-purple-600 to-purple-500"
            >
              Log Out
            </Button>
          ) : (
            <Button
              onClick={() => signIn()}
              className="mr-2 bg-gradient-to-tr from-red-600 to-red-500"
            >
              Sign In
            </Button>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Testimonials
            </Link>
            <Button variant="outline" className="w-full mb-2">
              Log In
            </Button>
            <Button className="w-full">Sign Up</Button>
          </nav>
        </div>
      )}
    </header>
  );
}
