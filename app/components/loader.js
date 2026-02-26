'use client';

export default function Loader({ fullScreen = true }) {
    return (
        <div className={`${fullScreen ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : 'w-full py-12'} flex flex-col items-center justify-center transition-all duration-300`}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>

                {/* Inner Pulse */}
                <div className="absolute h-8 w-8 animate-pulse rounded-full bg-emerald-500/20"></div>

                {/* Core Dot */}
                <div className="absolute h-2 w-2 rounded-full bg-emerald-600"></div>
            </div>

            {/* Loading Text */}
            <div className="mt-4 flex flex-col items-center gap-1">
                <span className="text-sm font-semibold tracking-wider text-emerald-900 uppercase" translate="no">
                    Jamiat Admin
                </span>
                <div className="flex gap-1">
                    <div className="h-1 w-1 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-1 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 animate-bounce rounded-full bg-emerald-600"></div>
                </div>
            </div>
        </div>
    );
}
