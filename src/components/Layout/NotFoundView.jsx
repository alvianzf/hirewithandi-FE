export default function NotFoundView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-3xl font-bold bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
          You&apos;ve strayed off the career path!
        </h2>
        <p className="text-lg text-white/70">
          We couldn&apos;t find this view. Maybe it&apos;s waiting in the 'Additional Interview' stage? Let&apos;s get you back to tracking jobs!
        </p>
        <div className="pt-8">
          <div className="text-[6rem] animate-bounce">
            🕵️‍♂️
          </div>
        </div>
      </div>
    </div>
  )
}
