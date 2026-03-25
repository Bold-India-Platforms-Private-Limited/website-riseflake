import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({
    isVisible,
    title = "Preparing your experience",
    message = "Just a sec..."
}: {
    isVisible: boolean,
    title?: string,
    message?: string
}) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                >
                    {/* 
            Entirely Transparent Backdrop 
            As requested: only the modal is blurred/transparent, the rest is clear.
          */}
                    <div className="absolute inset-0 bg-transparent" />

                    {/* Glassmorphism Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[32px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col items-center gap-8 max-w-sm w-full"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse rounded-full" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                className="relative bg-white/80 backdrop-blur-md p-5 rounded-full shadow-lg border border-white/20"
                            >
                                <Loader2 className="h-8 w-8 text-indigo-600" />
                            </motion.div>
                        </div>

                        <div className="text-center space-y-3">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                {title}
                            </h2>
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                                </div>
                                <p className="text-slate-600 font-bold text-xs uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;
