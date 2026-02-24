export default function WelcomeLoader({ darkMode }) {
    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="relative flex items-center justify-center mb-8">
                <div className={`absolute w-32 h-32 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin`}></div>
                <div className="animate-pulse-logo relative z-10">
                    <svg fill={darkMode ? "#60a5fa" : "#190075"} height="80px" width="80px" viewBox="0 0 32 32">
                        <path d="M32,18.9l-0.8-6.2c-0.2-1.5-1.5-2.6-3-2.6H1c-0.6,0-1,0.4-1,1v13c0,0.6,0.4,1,1,1h3.2c0.4,1.2,1.5,2,2.8,2 c1,0,2-0.5,2.5-1.3C10,26.5,11,27,12,27c1.3,0,2.4-0.8,2.8-2h7.4c0.4,1.2,1.5,2,2.8,2s2.4-0.8,2.8-2H31c0.6,0,1-0.4,1-1v-5 C32,19,32,18.9,32,18.9z M28.2,12c0.5,0,0.9,0.4,1,0.9l0.6,5.1h-1c-1.6,0-3-0.6-4.1-1.7C24.5,16.1,24.3,16,24,16H2v-4H28.2z M7,25 c-0.6,0-1-0.4-1-1c0,0,0,0,0,0s0,0,0,0c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1S7.6,25,7,25z M12,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S12.6,25,12,25z M25,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S25.6,25,25,25z"></path>
                    </svg>
                </div>
            </div>
            <p className={`text-sm font-bold tracking-widest uppercase animate-pulse ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                Sincronizando Flota Smart...
            </p>
        </div>
    );
}