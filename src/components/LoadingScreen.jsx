const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#060b18] text-white">
      
      <div className="flex flex-col items-center gap-6">
        
        {/* Glow Spinner */}
        <div className="relative flex items-center justify-center">
          
          <div className="h-16 w-16 rounded-full border-4 border-[#1a2a52]"></div>

          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-[#f6e925] border-r-[#f6e925] shadow-[0_0_25px_#f6e925]"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-[#f6e925]">
            Loading
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Preparing event data...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#f6e925] [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#f6e925] [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#f6e925]" />
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;