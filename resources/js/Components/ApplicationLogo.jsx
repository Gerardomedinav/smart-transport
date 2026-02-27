export default function ApplicationLogo({ className }) {
    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            {/* Aumentamos la altura del viewBox de 220 a 240 para dar espacio en la base */}
            <svg
                viewBox="0 0 400 240"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
            >
                <style>
                    {`
                        @keyframes road-flow {
                            from { stroke-dashoffset: 60; }
                            to { stroke-dashoffset: 0; }
                        }
                        @keyframes headlight-glow {
                            0%, 100% { filter: drop-shadow(0 0 5px #fbbf24); opacity: 0.8; }
                            50% { filter: drop-shadow(0 0 15px #fbbf24); opacity: 1; }
                        }
                        .road-line { animation: road-flow 0.6s linear infinite; }
                        .light-beam { animation: headlight-glow 2s ease-in-out infinite; }
                    `}
                </style>

                {/* Carretera - Terminamos un poco antes del borde inferior */}
                <path d="M160 120 L240 120 L360 210 L40 210 Z" fill="#0f172a" />
                
                <line 
                    x1="200" y1="130" x2="200" y2="200" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeDasharray="20, 20" 
                    className="road-line" 
                />

                {/* Vehículo Frontal */}
                <g transform="translate(165, 85)">
                    <path d="M10 5 L60 5 L65 30 L5 30 Z" fill="#3b82f6" />
                    <rect x="5" y="30" width="60" height="35" rx="5" fill="#2563eb" />
                    <circle cx="15" cy="50" r="6" fill="#fbbf24" className="light-beam" />
                    <circle cx="55" cy="50" r="6" fill="#fbbf24" className="light-beam" />
                </g>

                <defs>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Haces de luz con perspectiva frontal corregida */}
                <path d="M175 135 L120 210 L180 210 L185 135 Z" fill="url(#beamGrad)" className="light-beam" />
                <path d="M225 135 L220 210 L280 210 L225 135 Z" fill="url(#beamGrad)" className="light-beam" />
            </svg>
        </div>
    );
}