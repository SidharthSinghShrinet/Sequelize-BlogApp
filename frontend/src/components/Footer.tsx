import Logo from './Logo';

const Footer = () => (
    <footer className="bg-surface-container dark:bg-slate-950 mt-auto border-t border-outline-variant/30 dark:border-slate-900 py-lg">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-md">
            <Logo fontSize="text-xl" />
            <nav className="flex flex-wrap justify-center gap-x-sm gap-y-2">
                <a href="#" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 text-label-md">About Us</a>
                <a href="#" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 text-label-md">Privacy Policy</a>
                <a href="#" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 text-label-md">Terms of Service</a>
                <a href="#" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 text-label-md">Contact</a>
            </nav>
            <div className="text-secondary dark:text-slate-500 opacity-80 text-label-md">© 2024 ShowOff. All rights reserved.</div>
        </div>
    </footer>
);

export default Footer;
