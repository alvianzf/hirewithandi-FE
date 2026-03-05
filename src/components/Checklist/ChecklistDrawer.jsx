import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle2, Circle, AlertCircle, ChevronRight, Check } from 'lucide-react'
import { CHECKLIST_DATA, STATUS_OPTIONS } from './Constants'
import { useI18n } from '../../context/I18nContext'

// Simple debounce helper
const useDebounce = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null)
  return useCallback((...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
    setTimeoutId(newTimeoutId)
  }, [callback, delay, timeoutId])
}

export default function ChecklistDrawer({ isOpen, onClose, progressState, isComplete, onSave, onComplete, isMandatory }) {
  const { t } = useI18n()
  const [localState, setLocalState] = useState({})
  const [activeCategory, setActiveCategory] = useState(CHECKLIST_DATA[0].key)

  useEffect(() => {
    if (isOpen && progressState) {
      setLocalState(progressState)
    }
  }, [isOpen, progressState])

  const debouncedSave = useDebounce((newState) => {
    if (onSave) onSave(newState)
  }, 1000)

  const handleStatusChange = (categoryKey, itemId, statusId) => {
    setLocalState(prev => {
      const newState = {
        ...prev,
        [categoryKey]: {
          ...(prev[categoryKey] || {}),
          [itemId]: statusId
        }
      }
      debouncedSave(newState)
      return newState
    })
  }

  // Calculate overall progress
  const totalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0)
  let doneItems = 0
  let inProgressItems = 0
  
  Object.keys(localState).forEach(catKey => {
    Object.values(localState[catKey]).forEach(status => {
      if (status === 'DONE') doneItems++
      if (status === 'IN_PROGRESS') inProgressItems++
    })
  })

  const progressPct = Math.round((doneItems / totalItems) * 100)
  const isAllDone = doneItems === totalItems

  if (!isOpen) return null

  const activeCategoryData = CHECKLIST_DATA.find(c => c.key === activeCategory)

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isMandatory ? onClose : undefined}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-[#111] shadow-2xl transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <CheckCircle2 className="h-6 w-6 text-yellow-400" />
              Job Landing Checklist
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Complete these {totalItems} essentials to unlock your dashboard and jumpstart your career.
            </p>
          </div>
          {!isMandatory && (
            <button 
              onClick={onClose}
              className="rounded-full bg-white/[0.05] p-2 text-neutral-400 hover:bg-white/[0.1] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="border-b border-white/[0.04] bg-neutral-900/40 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="text-sm font-bold text-yellow-400">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> {doneItems} Done</span>
            <span className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-yellow-400" /> {inProgressItems} In Progress</span>
            <span className="flex items-center gap-1.5"><Circle className="h-3.5 w-3.5 text-neutral-600" /> {totalItems - doneItems - inProgressItems} Not Started</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-white/[0.05] bg-black/20 overflow-y-auto">
            {CHECKLIST_DATA.map((cat, idx) => {
              const catState = localState[cat.key] || {}
              const catTotal = cat.items.length
              const catDone = cat.items.filter(item => catState[item.id] === 'DONE').length
              const catProgress = Math.round((catDone / catTotal) * 100)

              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full text-left px-5 py-4 border-b border-white/[0.02] transition-colors relative ${
                    activeCategory === cat.key 
                      ? 'bg-white/[0.06] text-white' 
                      : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                  }`}
                >
                  {activeCategory === cat.key && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span> {idx + 1}. {cat.category}
                    </span>
                    {catDone === catTotal && <Check className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-neutral-500">{catDone}/{catTotal} completed</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">{activeCategoryData.icon}</span>
              {activeCategoryData.category}
            </h3>

            <div className="space-y-4">
              {activeCategoryData.items.map(item => {
                const currentStatus = localState[activeCategoryData.key]?.[item.id] || 'NOT_STARTED'
                
                return (
                  <div key={item.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
                    <div className="flex justify-between items-start gap-4">
                      <p className={`text-sm font-medium ${currentStatus === 'DONE' ? 'text-neutral-400 line-through decoration-neutral-600' : 'text-neutral-200'}`}>
                        {item.label}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {STATUS_OPTIONS.map(opt => {
                        const isSelected = currentStatus === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleStatusChange(activeCategoryData.key, item.id, opt.id)}
                            className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-all ${
                              isSelected ? opt.color : 'border-white/[0.05] bg-transparent text-neutral-500 hover:bg-white/[0.02]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Nav Footer within Content */}
            <div className="mt-12 flex justify-between items-center border-t border-white/[0.08] pt-6">
              {CHECKLIST_DATA.findIndex(c => c.key === activeCategory) < CHECKLIST_DATA.length - 1 ? (
                <button
                  onClick={() => {
                    const idx = CHECKLIST_DATA.findIndex(c => c.key === activeCategory)
                    setActiveCategory(CHECKLIST_DATA[idx + 1].key)
                  }}
                  className="ml-auto flex items-center gap-2 rounded-xl bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.1]"
                >
                  Next Category <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="w-full">
                  {!isComplete && (
                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => onComplete && onComplete(isAllDone)}
                        disabled={!isAllDone}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                          isAllDone 
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                        }`}
                      >
                        {isAllDone ? (
                          <>Complete Onboarding <CheckCircle2 className="h-4 w-4" /></>
                        ) : (
                          `Requires ${totalItems - doneItems} more Done to complete`
                        )}
                      </button>
                      
                      {totalItems - doneItems - inProgressItems === 0 && !isAllDone && (
                        <button
                          onClick={onClose}
                          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                        >
                          Go to Dashboard (Finish later)
                        </button>
                      )}
                    </div>
                  )}
                  {isComplete && (
                    <div className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-400">
                      <CheckCircle2 className="h-5 w-5" /> All tasks completed successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
