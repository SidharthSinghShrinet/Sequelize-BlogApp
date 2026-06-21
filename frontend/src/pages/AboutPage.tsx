import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import AboutHero from '../components/AboutHero';
import AutomationRoadmap from '../components/AutomationRoadmap';
import TechStackGrid from '../components/TechStackGrid';
import PlatformAnalytics from '../components/PlatformAnalytics';
import AiSandbox from '../components/AiSandbox';

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />
            
            <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-12 md:py-20 flex flex-col gap-24">
                <AboutHero />
                <AutomationRoadmap />
                <TechStackGrid />
                <PlatformAnalytics />
                <AiSandbox />
            </main>
            
            <Footer />
        </div>
    );
};

export default AboutPage;
