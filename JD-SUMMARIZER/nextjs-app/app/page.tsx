// In: app/page.tsx
// This final version includes the fully functional modal with all AI features.

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

// --- MOCK DATA & TYPES ---
const mockJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Innovate Inc.', location: 'Remote', platform: 'LinkedIn', applyUrl: 'https://www.linkedin.com/jobs', description: `Innovate Inc. is seeking a Senior Frontend Engineer to build our next-generation user interfaces. The ideal candidate will have over 5 years of experience with React, TypeScript, and Next.js. Responsibilities include collaborating with product teams, writing clean, scalable code, and mentoring junior developers. Experience with GraphQL and Tailwind CSS is a major plus. Must have strong communication skills and a passion for creating beautiful, functional user experiences.` },
  { id: 2, title: 'Product Manager, AI Division', company: 'Tech Solutions LLC', location: 'Pune, India', platform: 'Naukri', applyUrl: 'https://www.naukri.com/jobs-in-pune', description: `We are looking for a skilled Product Manager to lead our AI division. You will be responsible for the product planning and execution throughout the Product Lifecycle. This includes gathering and prioritizing product and customer requirements, defining the product vision, and working closely with engineering, sales, marketing, and support to ensure revenue and customer satisfaction goals are met. Requires a Bachelor's degree and 4+ years in product management, preferably with AI or machine learning products.` },
  { id: 3, title: 'Backend Developer (Python/Django)', company: 'DataCorp', location: 'Mumbai, India', platform: 'Internshala', applyUrl: 'https://internshala.com/jobs', description: `DataCorp is hiring a Backend Developer with expertise in Python and Django. You will be responsible for managing the interchange of data between the server and the users. Your primary focus will be the development of all server-side logic, ensuring high performance and responsiveness to requests from the front-end. You will also be responsible for integrating the front-end elements built by your co-workers into the application. A basic understanding of front-end technologies is therefore necessary as well.` },
];

interface Job { id: number; title: string; company: string; location: string; platform: string; applyUrl: string; description: string; }
interface Summary { role: string; keyResponsibilities: string[]; technicalSkills: string[]; softSkills: string[]; qualifications: string[]; }
interface MatchResult { matchScore: number; summary: string; strengths: string[]; gaps: string[]; }
interface CoverLetterResult { coverLetter: string; }

// --- ICONS & UI ---
const SparklesIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.94 18.06 3.5 21.5l.34-5.58a9.63 9.63 0 0 1 2.5-4.24 9.63 9.63 0 0 1 4.24-2.5l5.58-.34 3.44 6.44Z" /><path d="m18.06 9.94 3.44-6.44-.34 5.58a9.63 9.63 0 0 1-2.5 4.24 9.63 9.63 0 0 1-4.24 2.5l-5.58.34" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76-2.83-2.83" /></svg>);
const ExternalLinkIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const CopyIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>);
const CheckIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>);
const SunIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>);
const MoonIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>);
const LoadingSpinner = () => (<div className="flex justify-center items-center h-full py-10"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>);
const StatCard = ({ title, value }: { title: string; value: string }) => (<div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"><h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p></div>);

// --- HEADER COMPONENT ---
const Header = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('Your Name');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
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

    const ThemeToggleButton = () => {
        if (!mounted) { return <div className="w-9 h-9" />; }
        return (<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle theme">{theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}</button>);
    };

    const ProfileDropdown = () => (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img className="w-9 h-9 rounded-full" src={`https://placehold.co/100x100/E2E8F0/475569?text=${userName.charAt(0)}`} alt="User profile" />
                <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">{userName}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50">
                    <a href="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">My Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Sign Out</a>
                </div>
            )}
        </div>
    );

    return (
        <header className="container mx-auto p-4 sm:p-6 lg:px-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <a href="/" className="text-xl font-bold text-slate-900 dark:text-white">IntelliHire</a>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</a>
                        <a href="/profile" className="hover:text-blue-600 dark:hover:text-blue-400">Profile</a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggleButton />
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
};

// --- FOOTER COMPONENT ---
const Footer = () => (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div><h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Company</h3><ul className="mt-4 space-y-2"><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</a></li><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Careers</a></li></ul></div>
                <div><h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Resources</h3><ul className="mt-4 space-y-2"><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</a></li><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Help Center</a></li></ul></div>
                <div><h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Legal</h3><ul className="mt-4 space-y-2"><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Privacy</a></li><li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Terms</a></li></ul></div>
            </div>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center"><p className="text-base text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} IntelliHire. All rights reserved.</p></div>
        </div>
    </footer>
);


// --- MODAL COMPONENT ---
const SummaryModal = ({ job, onClose }: { job: Job | null; onClose: () => void; }) => {
    type Tab = 'summary' | 'match' | 'coverLetter';
    const [activeTab, setActiveTab] = useState<Tab>('summary');
    const [results, setResults] = useState<{ summary: Summary | null; match: MatchResult | null; coverLetter: CoverLetterResult | null; }>({ summary: null, match: null, coverLetter: null });
    const [isLoading, setIsLoading] = useState<Record<Tab, boolean>>({ summary: false, match: false, coverLetter: false });
    const [error, setError] = useState<string | null>(null);
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedResume = localStorage.getItem('userResume');
        const savedName = localStorage.getItem('userName');
        setResumeText(savedResume);
        setUserName(savedName);
    }, []);
    
    const fetchData = async (task: Tab) => {
        if (!job) return;
        if (task !== 'summary' && !resumeText) {
            setError("Please add your resume on the Profile page to use this feature.");
            return;
        }

        setIsLoading(prev => ({ ...prev, [task]: true }));
        setError(null);

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription: job.description, resumeText, userName, task }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch ${task}.`);
            }
            const data = await response.json();
            setResults(prev => ({ ...prev, [task]: data }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(prev => ({ ...prev, [task]: false }));
        }
    };

    useEffect(() => {
        if (job) {
            setResults({ summary: null, match: null, coverLetter: null });
            setActiveTab('summary');
            fetchData('summary');
        }
    }, [job]);

    const handleTabClick = (tab: Tab) => {
        setActiveTab(tab);
        if (!results[tab] && !isLoading[tab]) {
            fetchData(tab);
        }
    };
    
    const copyToClipboard = () => {
        if (results.coverLetter?.coverLetter) {
            navigator.clipboard.writeText(results.coverLetter.coverLetter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{job.company} - {job.location}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-3xl">&times;</button>
                    </div>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                    <nav className="-mb-px flex space-x-6">
                        {(['summary', 'match', 'coverLetter'] as Tab[]).map(tab => (
                            <button key={tab} onClick={() => handleTabClick(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>{tab.replace('L', ' L')}</button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto min-h-[300px]">
                    {error && <div className="p-4 bg-red-100 border-red-300 text-red-800 rounded-lg text-center">{error}</div>}
                    
                    {activeTab === 'summary' && (isLoading.summary ? <LoadingSpinner/> : results.summary && <SummaryContent data={results.summary} />)}
                    {activeTab === 'match' && (isLoading.match ? <LoadingSpinner/> : results.match && <MatchContent data={results.match} />)}
                    {activeTab === 'coverLetter' && (isLoading.coverLetter ? <LoadingSpinner/> : results.coverLetter && <CoverLetterContent data={results.coverLetter} copied={copied} onCopy={copyToClipboard} />)}
                </div>

                <div className="p-6 mt-auto bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center rounded-b-lg">
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"><ExternalLinkIcon className="w-5 h-5 mr-2" /> Apply on {job.platform}</a>
                </div>
            </div>
        </div>
    );
};

const SummaryContent = ({ data }: { data: Summary }) => (
    <div className="space-y-6">
        <div className="mb-6"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Role</h3><p className="text-slate-600 dark:text-slate-400">{data.role}</p></div>
        {(['keyResponsibilities', 'technicalSkills', 'softSkills', 'qualifications'] as (keyof Summary)[]).map(key => data[key] && data[key].length > 0 && <div key={key} className="mb-6"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3><ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">{data[key].map((item, index) => (<li key={index}>{item}</li>))}</ul></div>)}
    </div>
);

const MatchContent = ({ data }: { data: MatchResult }) => (
    <div>
        <div className="flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white ${data.matchScore >= 75 ? 'bg-green-500' : data.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>{data.matchScore}%</div>
            <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">{data.summary}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><h3 className="text-lg font-semibold text-green-600 mb-3">Strengths</h3><ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">{data.strengths.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><h3 className="text-lg font-semibold text-red-600 mb-3">Gaps to Address</h3><ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">{data.gaps.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
        </div>
    </div>
);

const CoverLetterContent = ({ data, copied, onCopy }: { data: CoverLetterResult, copied: boolean, onCopy: () => void }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Generated Cover Letter</h3>
            <button onClick={onCopy} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {copied ? <><CheckIcon className="w-4 h-4 mr-1" /> Copied!</> : <><CopyIcon className="w-4 h-4 mr-1" /> Copy</>}
            </button>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-md text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{data.coverLetter}</div>
    </div>
);

// --- JOB BOARD & SUMMARIZER ---
const JobBoard = ({ onJobClick }: { onJobClick: (job: Job) => void }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Jobs Listed" value="3" />
            <StatCard title="New This Week" value="1" />
            <StatCard title="Companies Featured" value="3" />
        </div>
        <div className="space-y-4">
            {mockJobs.map((job) => (
                <div key={job.id} onClick={() => onJobClick(job)} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">{job.title}</h2>
                            <p className="text-slate-600 dark:text-slate-300 font-medium">{job.company}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{job.location}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4"><span className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-md">{job.platform}</span></div>
                    </div>
                </div>
            ))}
        </div>
    </>
);

const JDSummarizer = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [summary, setSummary] = useState<Summary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = async () => {
        if (!jobDescription.trim()) { setError('Please paste a job description first.'); return; }
        setIsLoading(true); setError(null); setSummary(null);
        try {
            const response = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobDescription, task: 'summarize' }), });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to get summary.'); }
            const data: Summary = await response.json();
            setSummary(data);
        } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.'); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div><label htmlFor="job-description" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Paste Job Description</label><textarea id="job-description" rows={12} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="e.g., We are looking for a skilled developer..." className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y text-slate-700 dark:text-slate-200" /></div>
            <div className="mt-6 text-center"><button onClick={handleSummarize} disabled={isLoading} className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200">{isLoading ? 'Summarizing...' : <><SparklesIcon className="w-5 h-5 mr-2" />Get AI Summary</>}</button></div>
            {error && <div className="mt-6 p-4 bg-red-100 border-red-300 text-red-800 rounded-lg text-center">{error}</div>}
            {summary && <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700"><SummaryContent data={summary} /></div>}
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function App() {
    const [view, setView] = useState<'board' | 'summarizer'>('board');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto p-4 sm:p-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">AI Job Assistant</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your smart portal to the job market.</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 flex justify-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                            <button onClick={() => setView('board')} className={`w-1/2 py-2 px-4 rounded-md font-semibold transition-colors ${view === 'board' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>Job Board</button>
                            <button onClick={() => setView('summarizer')} className={`w-1/2 py-2 px-4 rounded-md font-semibold transition-colors ${view === 'summarizer' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>Summarize JD</button>
                        </div>
                        {view === 'board' ? <JobBoard onJobClick={setSelectedJob} /> : <JDSummarizer />}
                    </div>
                </div>
            </main>
            <Footer />
            {selectedJob && <SummaryModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </div>
    );
}
