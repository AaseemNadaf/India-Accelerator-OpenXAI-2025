// In: app/components/footer.tsx

'use client';

import React from 'react';

export const Footer = () => (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</a></li>
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Resources</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</a></li>
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Help Center</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Legal</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Privacy</a></li>
                        <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-base text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} IntelliHire. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
