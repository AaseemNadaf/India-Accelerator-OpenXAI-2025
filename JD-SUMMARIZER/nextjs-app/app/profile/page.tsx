// In: app/profile/page.tsx
// This is a new page for users to manage their profile and resume.

'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/header'; // We'll create this component next
import { Footer } from '../components/footer'; // And this one too

export default function ProfilePage() {
    const [resumeText, setResumeText] = useState('');
    const [userName, setUserName] = useState('John Doe');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Load saved data from localStorage when the component mounts
    useEffect(() => {
        const savedResume = localStorage.getItem('userResume');
        const savedName = localStorage.getItem('userName');
        if (savedResume) {
            setResumeText(savedResume);
        }
        if (savedName) {
            setUserName(savedName);
        }
    }, []);

    const handleSave = () => {
        setSaveStatus('saving');
        localStorage.setItem('userResume', resumeText);
        localStorage.setItem('userName', userName);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000); // Reset after 2 seconds
        }, 1000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto p-4 sm:p-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Your Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your information to get personalized results.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                            <div>
                                <label htmlFor="user-name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <input
                                    id="user-name"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-slate-700 dark:text-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="resume-text" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Paste Your Resume</label>
                                <textarea
                                    id="resume-text"
                                    rows={15}
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste the full text of your resume here..."
                                    className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y text-slate-700 dark:text-slate-200"
                                />
                            </div>
                            <div className="text-right">
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
