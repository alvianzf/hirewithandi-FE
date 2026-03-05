import { useState } from 'react'
import { CheckCircle2, AlertCircle, ChevronRight, Lock } from 'lucide-react'
import { CHECKLIST_DATA } from './Constants'

export default function ChecklistWidget({ progressState, isComplete, onOpen, onComplete }) {
  const [isCompleting, setIsCompleting] = useState(false);
  const totalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0)
  
  let doneItems = 0
  let inProgressItems = 0
  
  if (progressState) {
    Object.keys(progressState).forEach(catKey => {
      Object.values(progressState[catKey]).forEach(status => {
        if (status === 'DONE') doneItems++
        if (status === 'IN_PROGRESS') inProgressItems++
      })
    })
  }

  const pct = Math.round((doneItems / totalItems) * 100) || 0

  return (
    <div className="mb-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 md:p-8 relative overflow-hidden">
      {!isComplete && (
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
          <Lock className="h-32 w-32 text-yellow-500" />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-yellow-400" />
              Job Landing Checklist
            </h2>
            {isComplete ? (
              <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                Completed
              </span>
            ) : (
              <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-bold text-yellow-400 uppercase tracking-wider animate-pulse">
                Action Required
              </span>
            )}
          </div>
          
          <p className="text-sm text-neutral-300 max-w-xl">
            {isComplete 
              ? "You've successfully completed your onboarding. You can review and update your responses at any time to keep your profile sharp."
              : "Complete the 52-step success checklist crafted by our experts to ensure you are fully prepared to land your next job."}
          </p>

          <div className="mt-5 max-w-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-400">Overall Progress</span>
              <span className="text-xs font-bold text-yellow-400">{pct}% ({doneItems}/{totalItems})</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="text-green-400 font-medium">{doneItems} Done</span>
              <span className="text-yellow-400 font-medium">{inProgressItems} In Progress</span>
              <span className="text-neutral-500 font-medium">{totalItems - doneItems - inProgressItems} Not Started</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-auto">
          {doneItems === totalItems && !isComplete && (
            <button
              onClick={async () => {
                setIsCompleting(true);
                await onComplete(true);
                setIsCompleting(false);
              }}
              disabled={isCompleting}
              className="group flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 px-6 py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? 'Completing...' : 'Complete Onboarding'}
              {!isCompleting && <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />}
            </button>
          )}
          <button
            onClick={onOpen}
            className="group flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-yellow-300"
          >
            {isComplete ? 'Review Checklist' : 'Manage Checklist'}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
