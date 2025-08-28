'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const SunIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>);
const MoonIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>);

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) { return <div className="w-9 h-9" />; }
    return (<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle theme">{theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}</button>);
};

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('Your Name');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        if (savedName) setUserName(savedName);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img className="w-9 h-9 rounded-full" src={`https://placehold.co/100x100/E2E8F0/475569?text=${userName.charAt(0)}`} alt="User profile" />
                <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">{userName}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">My Profile</Link>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Sign Out</a>
                </div>
            )}
        </div>
    );
};

export const Header = () => (
    <header className="container mx-auto p-4 sm:p-6 lg:px-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">IntelliHire</Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
                    <Link href="/profile" className="hover:text-blue-600 dark:hover:text-blue-400">Profile</Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <ThemeToggleButton />
                <ProfileDropdown />
            </div>
        </div>
    </header>
);
