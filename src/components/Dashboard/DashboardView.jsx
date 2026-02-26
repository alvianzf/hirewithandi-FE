import { useJobs } from '../../context/JobContext'
import { COLUMNS, COLUMN_MAP } from '../../utils/constants'
import { daysSince, daysLabel } from '../../utils/helpers'
import { useI18n } from '../../context/I18nContext'
import {
  TrendingUp, TrendingDown, DollarSign, Briefcase, Clock, MapPin,
  Globe, Building2, ArrowLeftRight, Target, AlertTriangle, Award,
  BarChart3, PieChart, Activity
} from 'lucide-react'

export default function DashboardView() {
  const { allJobs } = useJobs()
  const { t, colLabel } = useI18n()

  // ---- Compute stats ----
  const total = allJobs.length
  const byStatus = {}
  COLUMNS.forEach(col => { byStatus[col.id] = allJobs.filter(j => j.status === col.id) })

  // Conversion funnel
  const applied = total - byStatus.wishlist.length
  const interviewed = byStatus.hr_interview.length + byStatus.technical_interview.length + byStatus.additional_interview.length + byStatus.offered.length
  const offered = byStatus.offered.length
  const rejected = byStatus.rejected.length

  const interviewRate = applied > 0 ? ((interviewed / applied) * 100).toFixed(1) : 0
  const offerRate = applied > 0 ? ((offered / applied) * 100).toFixed(1) : 0
  const rejectionRate = applied > 0 ? ((rejected / applied) * 100).toFixed(1) : 0

  // Work type distribution
  const workTypes = { remote: 0, onsite: 0, hybrid: 0 }
  allJobs.forEach(j => { if (j.workType) workTypes[j.workType]++ })

  // Separate salaries by IDR and USD
  const parseCurrencySalaries = (jobsArray) => {
    const idr = []
    const usd = []
    
    jobsArray.forEach(j => {
      if (!j.salary) return
      
      const s = j.salary.toUpperCase()
      const isUsd = s.includes('USD') || s.includes('$')
      const isIdr = s.includes('IDR') || s.includes('RP') || (!isUsd && s.match(/[\d,.]+(JT|M)/i))
      
      // Extract numbers (removing commas, Rp, $, etc)
      // E.g. Rp10,000,000 -> 10000000
      // 10jt -> 10000000
      let numStr = s.replace(/[^0-9.,]/g, '')
      if (s.toLowerCase().includes('jt')) {
        let n = parseFloat(numStr)
        if (!isNaN(n)) numStr = (n * 1000000).toString()
      }
      
      const num = parseFloat(numStr.replace(/,/g, ''))
      
      if (!isNaN(num) && num > 0) {
        if (isUsd) usd.push(num)
        else idr.push(num) // Default to IDR if not explicitly USD
      }
    })
    
    return { idr, usd }
  }

  const allSals = parseCurrencySalaries(allJobs)
  
  const getMinMaxAvg = (arr) => {
    if (arr.length === 0) return { min: 0, max: 0, avg: 0 }
    return {
      min: Math.min(...arr),
      max: Math.max(...arr),
      avg: arr.reduce((a, b) => a + b, 0) / arr.length
    }
  }

  const idrStats = getMinMaxAvg(allSals.idr)
  const usdStats = getMinMaxAvg(allSals.usd)

  // Opportunity lost (Sum of max rejected salaries in IDR and USD)
  // For each rejected job, we find its max salary (if it's a range)
  const calculateOpportunityLost = (jobsArray) => {
    let idrLost = 0
    let usdLost = 0
    
    jobsArray.forEach(j => {
      if (!j.salary) return
      const s = j.salary.toUpperCase()
      const isUsd = s.includes('USD') || s.includes('$')
      
      // Try to find the max number in the string (e.g. "Rp 10.000.000 - Rp 15.000.000" -> 15000000)
      const nums = (s.match(/[\d,.]+(?:JT|M)?/gi) || []).map(numStr => {
        let cleanMatch = numStr.replace(/[^0-9.,]/g, '')
        let n = parseFloat(cleanMatch.replace(/,/g, ''))
        if (numStr.toLowerCase().includes('jt')) {
             n = n * 1000000
        }
        return n
      }).filter(n => !isNaN(n))
      
      if (nums.length > 0) {
        const maxVal = Math.max(...nums)
        if (isUsd) usdLost += maxVal
        else idrLost += maxVal
      }
    })
    
    return { idrLost, usdLost }
  }

  const { idrLost, usdLost } = calculateOpportunityLost(byStatus.rejected)

  // Average days in pipeline
  const daysInPipeline = allJobs.map(j => daysSince(j.dateApplied)).filter(d => d > 0)
  const avgDays = daysInPipeline.length > 0 ? (daysInPipeline.reduce((a, b) => a + b, 0) / daysInPipeline.length).toFixed(0) : 0

  // Average days per stage
  const avgDaysPerStage = {}
  COLUMNS.forEach(col => {
    const jobs = byStatus[col.id]
    if (jobs.length > 0) {
      const days = jobs.map(j => daysSince(j.statusChangedAt))
      avgDaysPerStage[col.id] = (days.reduce((a, b) => a + b, 0) / days.length).toFixed(0)
    } else {
      avgDaysPerStage[col.id] = 0
    }
  })

  // Stale jobs (stuck > 14 days)
  const staleJobs = allJobs.filter(j =>
    daysSince(j.statusChangedAt) >= 14 &&
    j.status !== 'offered' && j.status !== 'rejected'
  )

  // Most active week
  const weekMap = {}
  allJobs.forEach(j => {
    const d = new Date(j.dateApplied)
    const weekStart = new Date(d)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const key = weekStart.toISOString().slice(0, 10)
    weekMap[key] = (weekMap[key] || 0) + 1
  })
  const mostActiveWeek = Object.entries(weekMap).sort((a, b) => b[1] - a[1])[0]

  const formatIDR = (n) => {
    if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}Jt`
    if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}K`
    return `Rp ${n.toFixed(0)}`
  }
  
  const formatUSD = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  if (total === 0) {
    return (
      <div className="view-transition flex flex-1 items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-neutral-700" />
          <p className="mt-3 text-sm text-neutral-500">{t('noApplicationsYet')}</p>
          <p className="mt-1 text-xs text-neutral-600">{t('addFirstJob')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-transition flex-1 overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Top KPI cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label={t('all')}
            value={total}
            color="#FFD700"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            label={colLabel('offered')}
            value={offered}
            color="#4ADE80"
            sub={`${offerRate}% rate`}
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label={colLabel('rejected')}
            value={rejected}
            color="#EF4444"
            sub={`${rejectionRate}% rate`}
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Avg. Days"
            value={avgDays}
            color="#06b6d4"
            sub="in pipeline"
          />
        </div>

        {/* Conversion funnel */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-yellow-400" />
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            {[
              { label: t('all'), count: total, pct: 100, color: '#FFD700' },
              { label: colLabel('applied'), count: applied, pct: total > 0 ? (applied / total * 100) : 0, color: '#3b82f6' },
              { label: 'Interviewed', count: interviewed, pct: total > 0 ? (interviewed / total * 100) : 0, color: '#06b6d4' },
              { label: colLabel('offered'), count: offered, pct: total > 0 ? (offered / total * 100) : 0, color: '#4ADE80' },
            ].map((step, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-300">{step.label}</span>
                  <span className="text-xs text-neutral-400">{step.count} ({step.pct.toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(step.pct, 1)}%`,
                      backgroundColor: step.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Status breakdown */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="h-4 w-4 text-yellow-400" />
              Status Breakdown
            </h3>
            <div className="space-y-2.5">
              {COLUMNS.map(col => {
                const count = byStatus[col.id].length
                const pct = total > 0 ? (count / total * 100) : 0
                return (
                  <div key={col.id} className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                    <span className="flex-1 text-xs text-neutral-300 truncate">{colLabel(col.id)}</span>
                    <span className="text-xs font-medium text-neutral-400">{count}</span>
                    <div className="w-20 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: col.color, opacity: 0.7 }}
                      />
                    </div>
                    <span className="w-10 text-right text-[11px] text-neutral-500">{pct.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Work type distribution */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-yellow-400" />
              {t('workType')} Distribution
            </h3>
            <div className="space-y-4">
              {[
                { key: 'remote', icon: '🌍', color: '#3b82f6' },
                { key: 'onsite', icon: '🏢', color: '#f59e0b' },
                { key: 'hybrid', icon: '🔄', color: '#8b5cf6' },
              ].map(wt => {
                const count = workTypes[wt.key]
                const pct = total > 0 ? (count / total * 100) : 0
                return (
                  <div key={wt.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-neutral-300 flex items-center gap-1.5">
                        <span>{wt.icon}</span> {t(wt.key)}
                      </span>
                      <span className="text-xs font-medium text-neutral-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%`, backgroundColor: wt.color, opacity: 0.7 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Salary insights */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              Salary Insights
            </h3>
            
            {allSals.idr.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-400 mb-3 block">IDR Salaries</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-white/[0.03]">
                    <p className="text-[10px] text-neutral-500 mb-1">Lowest</p>
                    <p className="text-sm font-bold text-white">{formatIDR(idrStats.min)}</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.05)]">
                    <p className="text-[10px] text-neutral-500 mb-1">Average</p>
                    <p className="text-sm font-bold text-yellow-400">{formatIDR(idrStats.avg)}</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-white/[0.03]">
                    <p className="text-[10px] text-neutral-500 mb-1">Highest</p>
                    <p className="text-sm font-bold text-green-400">{formatIDR(idrStats.max)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {allSals.usd.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-neutral-400 mb-3 block">USD Salaries</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-white/[0.03]">
                    <p className="text-[10px] text-neutral-500 mb-1">Lowest</p>
                    <p className="text-sm font-bold text-white">{formatUSD(usdStats.min)}</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.05)]">
                    <p className="text-[10px] text-neutral-500 mb-1">Average</p>
                    <p className="text-sm font-bold text-yellow-400">{formatUSD(usdStats.avg)}</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.02] p-3 border border-white/[0.03]">
                    <p className="text-[10px] text-neutral-500 mb-1">Highest</p>
                    <p className="text-sm font-bold text-green-400">{formatUSD(usdStats.max)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {allSals.idr.length === 0 && allSals.usd.length === 0 && (
              <p className="text-xs text-neutral-500 py-4 text-center border border-dashed border-white/10 rounded-xl">
                No salary data yet. Add salary ranges to your applications.
              </p>
            )}

            {/* Opportunity lost */}
            {(idrLost > 0 || usdLost > 0) && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-bold text-red-400">Opportunity Lost</span>
                </div>
                <div className="flex items-end gap-3">
                  {idrLost > 0 && <p className="text-xl font-bold text-red-400 tracking-tight">{formatIDR(idrLost)}</p>}
                  {usdLost > 0 && <p className="text-xl font-bold text-red-400 tracking-tight">{formatUSD(usdLost)}</p>}
                </div>
                <p className="mt-1.5 text-[11px] text-red-400/70">
                  Total maximum potential salary from rejected applications
                </p>
              </div>
            )}
          </div>

          {/* Activity insights */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-yellow-400" />
              Activity Insights
            </h3>
            <div className="space-y-3">
              {mostActiveWeek && (
                <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                  <span className="text-xs text-neutral-400">Most Active Week</span>
                  <span className="text-xs font-medium text-white">
                    {new Date(mostActiveWeek[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {mostActiveWeek[1]} apps
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-neutral-400">Interview Rate</span>
                <span className="text-xs font-bold text-cyan-400">{interviewRate}%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-neutral-400">Offer Rate</span>
                <span className="text-xs font-bold text-green-400">{offerRate}%</span>
              </div>

              {/* Stale applications */}
              {staleJobs.length > 0 && (
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">
                      {staleJobs.length} Stale Application{staleJobs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Stuck in the same stage for 14+ days
                  </p>
                  <div className="mt-2 space-y-1">
                    {staleJobs.slice(0, 3).map(j => (
                      <p key={j.id} className="text-[11px] text-amber-400/80">
                        • {j.company} — {daysSince(j.statusChangedAt)} days in {colLabel(j.status)}
                      </p>
                    ))}
                    {staleJobs.length > 3 && (
                      <p className="text-[11px] text-neutral-500">+{staleJobs.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avg time per stage */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            Average Time per Stage
          </h3>
          <div className="flex flex-wrap gap-3">
            {COLUMNS.map(col => {
              const avg = avgDaysPerStage[col.id]
              const count = byStatus[col.id].length
              return (
                <div
                  key={col.id}
                  className="flex-1 min-w-[100px] rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center"
                >
                  <div
                    className="mx-auto mb-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <p className="text-lg font-bold text-white">{avg}<span className="text-xs text-neutral-500 ml-0.5">d</span></p>
                  <p className="text-[10px] text-neutral-500 truncate">{colLabel(col.id)}</p>
                  <p className="text-[10px] text-neutral-600">{count} jobs</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-neutral-500" style={{ color }}>{icon}</div>
        <span className="text-xs font-medium text-neutral-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-neutral-500">{sub}</p>}
    </div>
  )
}
