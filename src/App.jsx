
import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, Bookmark, Building2, CalendarDays, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Command, Download, FileCheck2, Filter,
  LayoutDashboard, MapPin, Menu, Plus, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles,
  TrendingUp, X, Zap
} from 'lucide-react'

const initialTenders = [
  {
    id: 'TS-2026-1042',
    title: 'Website Development & Maintenance',
    department: 'Municipal Corporation',
    location: 'New Delhi',
    category: 'IT Services',
    value: 450000,
    deadline: '2026-10-28',
    match: 94,
    status: 'Strong match',
  },
  {
    id: 'TS-2026-1043',
    title: 'Supply of Computer Equipment',
    department: 'Education Department',
    location: 'Noida, Uttar Pradesh',
    category: 'Electronics',
    value: 800000,
    deadline: '2026-10-30',
    match: 81,
    status: 'Good match',
  },
  {
    id: 'TS-2026-1044',
    title: 'Digital Records Management',
    department: 'Public Administration',
    location: 'Lucknow, Uttar Pradesh',
    category: 'IT Services',
    value: 320000,
    deadline: '2026-11-02',
    match: 88,
    status: 'Strong match',
  },
  {
    id: 'TS-2026-1045',
    title: 'Office Furniture Supply',
    department: 'District Administration',
    location: 'Ghaziabad, Uttar Pradesh',
    category: 'Supply',
    value: 210000,
    deadline: '2026-11-05',
    match: 62,
    status: 'Review match',
  },
  {
    id: 'TS-2026-1046',
    title: 'Cloud Hosting & IT Support',
    department: 'Smart City Mission',
    location: 'Greater Noida, Uttar Pradesh',
    category: 'IT Services',
    value: 650000,
    deadline: '2026-11-08',
    match: 91,
    status: 'Strong match',
  },
]

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Find Tenders', icon: Search },
  { label: 'Saved Tenders', icon: Bookmark },
  { label: 'Deadline Tracker', icon: CalendarDays },
  { label: 'Analytics', icon: Activity },
]

const formatMoney = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} L`
  return `₹${value.toLocaleString('en-IN')}`
}

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [saved, setSaved] = useState([])
  const [selectedTender, setSelectedTender] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('match')
  const [notice, setNotice] = useState('')

  const tenders = useMemo(() => {
    let list = [...initialTenders]

    if (activePage === 'Saved Tenders') {
      list = list.filter((t) => saved.includes(t.id))
    }

    if (activePage === 'Deadline Tracker') {
      list.sort((a, b) => a.deadline.localeCompare(b.deadline))
    }

    list = list.filter((t) => {
      const text = `${t.title} ${t.department} ${t.location} ${t.category}`.toLowerCase()
      const matchesSearch = text.includes(search.toLowerCase())
      const matchesCategory = category === 'All categories' || t.category === category
      return matchesSearch && matchesCategory
    })

    if (sortBy === 'match') list.sort((a, b) => b.match - a.match)
    if (sortBy === 'value') list.sort((a, b) => b.value - a.value)
    if (sortBy === 'deadline') list.sort((a, b) => a.deadline.localeCompare(b.deadline))

    return list
  }, [activePage, saved, search, category, sortBy])

  const navigate = (page) => {
    setActivePage(page)
    setMobileMenu(false)
    setSelectedTender(null)
  }

  const toggleSaved = (id) => {
    const isSaved = saved.includes(id)
    setSaved((current) =>
      isSaved ? current.filter((item) => item !== id) : [...current, id]
    )
    setNotice(isSaved ? 'Tender removed from saved list' : 'Tender saved successfully')
    window.setTimeout(() => setNotice(''), 2200)
  }

  const exportCSV = () => {
    const rows = [
      ['Tender ID', 'Title', 'Department', 'Location', 'Category', 'Value INR', 'Deadline', 'Match %'],
      ...tenders.map((t) => [
        t.id, t.title, t.department, t.location, t.category,
        t.value, t.deadline, t.match,
      ]),
    ]

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tender-saathi-opportunities.csv'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Tender list exported to CSV')
    window.setTimeout(() => setNotice(''), 2200)
  }

  const pageTitle = {
    Overview: 'Overview',
    'Find Tenders': 'Explore Tenders',
    'Saved Tenders': 'Saved Tenders',
    'Deadline Tracker': 'Deadline Tracker',
    Analytics: 'Tender Analytics',
    'Eligibility Checker': 'Eligibility Checker',
    Settings: 'Workspace Settings',
  }[activePage] || activePage

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      {notice && (
        <div className="fixed right-5 top-5 z-[70] flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-[#111d2e] px-4 py-3 text-sm text-cyan-200 shadow-2xl">
          <CheckCircle2 size={17} /> {notice}
        </div>
      )}

      {mobileMenu && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0a1120] px-4 py-6 transition-transform duration-200 md:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => navigate('Overview')}
          className="mb-10 flex items-center gap-3 px-2 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-300 to-cyan-500 text-[#06101c] shadow-lg shadow-cyan-500/15">
            <Command size={23} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-tight">Tender Saathi</div>
            <div className="mt-0.5 text-[10px] font-bold tracking-[0.22em] text-cyan-300">PRO INTELLIGENCE</div>
          </div>
        </button>

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </div>

        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => navigate(label)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${
                activePage === label
                  ? 'border border-cyan-300/10 bg-cyan-300/[0.09] font-semibold text-cyan-200'
                  : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Saved Tenders' && saved.length > 0 && (
                <span className="ml-auto rounded-md bg-cyan-300/10 px-2 py-0.5 text-[10px] text-cyan-200">
                  {saved.length}
                </span>
              )}
              {activePage === label && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />}
            </button>
          ))}
        </nav>

        <div className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          Preferences
        </div>

        <button
          onClick={() => navigate('Eligibility Checker')}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${activePage === 'Eligibility Checker' ? 'bg-cyan-300/[0.09] text-cyan-200' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
        >
          <ShieldCheck size={18} /> Eligibility Checker
        </button>
        <button
          onClick={() => navigate('Settings')}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${activePage === 'Settings' ? 'bg-cyan-300/[0.09] text-cyan-200' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
        >
          <Settings2 size={18} /> Settings
        </button>

        <div className="mt-auto">
          <div className="overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.09] to-blue-500/[0.03] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
              <Sparkles size={18} />
            </div>
            <div className="text-sm font-semibold">Smarter tender discovery</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Find opportunities that fit your business goals.
            </p>
            <button
              onClick={() => navigate('Eligibility Checker')}
              className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Explore matching <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] px-2 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-200 to-blue-500 text-sm font-bold text-slate-950">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold">Business Workspace</div>
              <div className="mt-1 text-[10px] text-slate-500">Demo account</div>
            </div>
            <button aria-label="Help" onClick={() => setNotice('Tender Saathi Pro prototype help')} className="text-slate-500 hover:text-cyan-200">
              <CircleHelp size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen md:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080d18]/90 px-5 backdrop-blur-xl md:px-9">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
              className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="text-[11px] text-slate-500">Workspace <span className="mx-1 text-slate-700">/</span> <span className="text-slate-300">{pageTitle}</span></div>
              <h1 className="mt-1 text-base font-semibold tracking-tight">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] text-slate-400 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Prototype environment
            </div>
            <button
              aria-label="Notifications"
              onClick={() => setNotice('You are all caught up!')}
              className="relative rounded-xl p-2 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 ring-2 ring-[#080d18]" />
            </button>
            <div className="hidden h-7 w-px bg-white/10 sm:block" />
            <button
              onClick={() => navigate('Settings')}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-bold text-cyan-200">
                A
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold">My Business</div>
                <div className="mt-0.5 text-[10px] text-slate-500">Free workspace</div>
              </div>
              <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-5 md:p-9">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-cyan-200">
                <Zap size={12} /> PROCUREMENT INTELLIGENCE
              </div>
              <h2 className="text-[30px] font-bold leading-tight tracking-[-0.04em] sm:text-[38px]">
                Discover your next
                <span className="text-cyan-300"> opportunity.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                A clearer way for small businesses to discover tenders, assess fit and stay ahead of deadlines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <Download size={15} /> Export list
              </button>
              <button
                onClick={() => navigate('Find Tenders')}
                className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#06101c] shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-200"
              >
                <Search size={15} /> Find tenders <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          {activePage === 'Settings' ? (
            <section className="max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0d1525] p-6 md:p-8">
              <h2 className="text-lg font-bold">Workspace settings</h2>
              <p className="mt-2 text-sm text-slate-400">These are prototype settings. Business profiles and account persistence will be added in a later step.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <div className="text-sm font-semibold">Workspace name</div>
                  <div className="mt-2 text-sm text-slate-400">My Business</div>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <div className="text-sm font-semibold">Preferred region</div>
                  <div className="mt-2 text-sm text-slate-400">India · Editable business profile coming next</div>
                </div>
                <button onClick={() => setNotice('Settings saved for this demo session')} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950">Save preferences</button>
              </div>
            </section>
          ) : (
            <>
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {[
                  { label: 'Opportunities tracked', value: '128', note: '+12 this week', icon: Building2, color: 'text-cyan-200', glow: 'bg-cyan-300/10', trend: 'up' },
                  { label: 'Potential matches', value: '24', note: 'Illustrative profile match', icon: Sparkles, color: 'text-violet-300', glow: 'bg-violet-400/10', trend: 'up' },
                  { label: 'Opportunity value', value: '₹2.4 Cr', note: 'Illustrative total value', icon: TrendingUp, color: 'text-emerald-300', glow: 'bg-emerald-400/10', trend: 'up' },
                  { label: 'Upcoming deadlines', value: '08', note: 'Verify official notices', icon: Clock3, color: 'text-amber-300', glow: 'bg-amber-400/10', trend: 'clock' },
                ].map(({ label, value, note, icon: Icon, color, glow, trend }) => (
                  <article key={label} className="group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0d1525] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/20">
                    <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-300/[0.025] blur-2xl transition group-hover:bg-cyan-300/[0.07]" />
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-400">{label}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${glow} ${color}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="relative mt-5 flex items-end justify-between">
                      <div className="text-[29px] font-bold tracking-tight">{value}</div>
                      {trend === 'clock' ? <CalendarDays size={17} className={color} /> : <ArrowUpRight size={18} className="text-emerald-300" />}
                    </div>
                    <div className="relative mt-2 text-[11px] text-slate-500">{note}</div>
                  </article>
                ))}
              </section>

              <section className="relative mb-8 overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#0d1727]">
                <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full bg-cyan-300/[0.06] blur-[90px]" />
                <div className="pointer-events-none absolute right-1/3 top-0 h-44 w-44 rounded-full bg-blue-500/[0.04] blur-[70px]" />
                <div className="relative flex flex-col justify-between gap-7 p-6 sm:p-8 lg:flex-row lg:items-center">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                      <Sparkles size={14} /> Smart opportunity matching
                    </div>
                    <h3 className="max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-[28px]">
                      Spend less time searching.
                      <span className="text-cyan-300"> Find a better fit.</span>
                    </h3>
                    <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                      Explore illustrative match scores and review the requirements that matter before preparing a bid.
                    </p>
                    <button
                      onClick={() => navigate('Eligibility Checker')}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.13]"
                    >
                      Explore smart matches <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="flex items-center gap-5 self-center rounded-2xl border border-white/[0.07] bg-[#080f1c]/70 p-5 sm:px-7">
                    <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full" style={{ background: 'conic-gradient(#67e8f9 0deg 338deg, #1e293b 338deg 360deg)' }}>
                      <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-[#0c1625]">
                        <span className="text-2xl font-bold tracking-tight">94%</span>
                        <span className="mt-1 text-[9px] text-slate-500">DEMO MATCH</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Top opportunity</div>
                      <div className="mt-2 text-[11px] text-slate-400">IT Services</div>
                      <div className="mt-1 text-[11px] text-slate-400">Illustrative score</div>
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-200"><Activity size={12} /> Match preview</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {activePage === 'Saved Tenders' ? 'Your saved opportunities' : activePage === 'Deadline Tracker' ? 'Upcoming deadlines' : activePage === 'Analytics' ? 'Opportunity insights' : activePage === 'Eligibility Checker' ? 'Potential business matches' : activePage === 'Find Tenders' ? 'Explore all opportunities' : 'Recommended opportunities'}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500">
                      {tenders.length} sample records <span className="mx-1.5 text-slate-700">·</span> Sorted by relevance
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition ${showFilters ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-300 hover:bg-white/[0.04]'}`}
                  >
                    <SlidersHorizontal size={15} /> Filters <ChevronDown size={14} />
                  </button>
                </div>

                <div className="mb-4 flex flex-col gap-3 lg:flex-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1525] px-4 transition focus-within:border-cyan-300/30">
                    <Search size={17} className="shrink-0 text-slate-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search tender title, department, location..."
                      className="w-full min-w-0 bg-transparent py-3.5 text-xs text-slate-200 outline-none placeholder:text-slate-600"
                    />
                    {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} className="text-slate-500" /></button>}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0d1525] px-3.5">
                    <Filter size={15} className="text-slate-500" />
                    <select
                      aria-label="Tender category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-transparent py-3.5 text-xs text-slate-300 outline-none"
                    >
                      <option className="bg-[#0d1525]" value="All categories">All categories</option>
                      <option className="bg-[#0d1525]" value="IT Services">IT Services</option>
                      <option className="bg-[#0d1525]" value="Electronics">Electronics</option>
                      <option className="bg-[#0d1525]" value="Supply">Supply</option>
                    </select>
                  </div>
                </div>

                {showFilters && (
                  <div className="mb-4 flex flex-col gap-3 rounded-xl border border-cyan-300/15 bg-[#0d1525] p-4 sm:flex-row sm:items-center">
                    <label className="flex flex-1 flex-col gap-2 text-[11px] text-slate-400">
                      Sort opportunities
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-white/10 bg-[#080d18] px-3 py-2.5 text-xs text-slate-200 outline-none">
                        <option value="match">Highest match first</option>
                        <option value="value">Highest value first</option>
                        <option value="deadline">Soonest deadline first</option>
                      </select>
                    </label>
                    <button onClick={() => { setCategory('All categories'); setSearch(''); setSortBy('match') }} className="mt-5 rounded-lg border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5 sm:mt-0">
                      Reset filters
                    </button>
                  </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0d1525]">
                  <div className="hidden grid-cols-[minmax(0,1.8fr)_minmax(130px,0.8fr)_minmax(100px,0.65fr)_minmax(105px,0.7fr)_44px] gap-4 border-b border-white/[0.07] bg-white/[0.015] px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.13em] text-slate-500 xl:grid">
                    <span>Tender opportunity</span>
                    <span>Location</span>
                    <span>Estimated value</span>
                    <span>Closing date</span>
                    <span />
                  </div>

                  {tenders.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500"><Search size={21} /></div>
                      <h4 className="mt-4 text-sm font-semibold">No matching opportunities</h4>
                      <p className="mt-2 text-xs text-slate-500">Try another keyword or adjust your filters.</p>
                      <button onClick={() => { setSearch(''); setCategory('All categories'); if (activePage === 'Saved Tenders') navigate('Overview') }} className="mt-4 text-xs font-semibold text-cyan-200">Clear search and filters</button>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.055]">
                      {tenders.map((tender) => (
                        <article key={tender.id} className="px-5 py-5 transition hover:bg-white/[0.018] sm:px-6">
                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(130px,0.8fr)_minmax(100px,0.65fr)_minmax(105px,0.7fr)_44px] xl:items-center xl:gap-4">
                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-semibold tracking-wider text-slate-500">{tender.id}</span>
                                <span className="rounded-md border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-1 text-[9px] font-medium text-cyan-200">{tender.category}</span>
                              </div>
                              <button onClick={() => setSelectedTender(selectedTender === tender.id ? null : tender.id)} className="text-left text-[13px] font-semibold leading-5 text-slate-100 transition hover:text-cyan-200">
                                {tender.title}
                              </button>
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500"><Building2 size={12} /> {tender.department}</div>
                              <div className="mt-3 flex items-center gap-2">
                                <div className="h-1 w-[62px] overflow-hidden rounded-full bg-white/[0.08]">
                                  <div className="h-full rounded-full bg-cyan-300" style={{ width: `${tender.match}%` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-cyan-200">{tender.match}% match</span>
                                <span className="text-[9px] text-slate-600">· Demo estimate</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400 xl:block">
                              <MapPin size={14} className="shrink-0 text-slate-600 xl:mb-1.5" />
                              {tender.location}
                            </div>

                            <div className="flex items-center justify-between xl:block">
                              <span className="text-[10px] text-slate-500 xl:hidden">Estimated value</span>
                              <span className="text-sm font-semibold tracking-tight text-slate-100">{formatMoney(tender.value)}</span>
                            </div>

                            <div className="flex items-center justify-between xl:block">
                              <span className="text-[10px] text-slate-500 xl:hidden">Closing date</span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <CalendarDays size={13} className="text-slate-500" />
                                {formatDate(tender.deadline)}
                              </div>
                            </div>

                            <button
                              aria-label={saved.includes(tender.id) ? 'Remove saved tender' : 'Save tender'}
                              onClick={() => toggleSaved(tender.id)}
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${saved.includes(tender.id) ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200' : 'border-white/[0.08] text-slate-500 hover:border-cyan-300/25 hover:text-cyan-200'}`}
                            >
                              <Bookmark size={16} fill={saved.includes(tender.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>

                          {selectedTender === tender.id && (
                            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#080f1b] p-4 sm:p-5">
                              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                <div>
                                  <h4 className="text-sm font-semibold">Opportunity overview</h4>
                                  <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400">
                                    This is a demonstration record for the Tender Saathi Pro prototype. Review the official tender notice, eligibility criteria, turnover requirements, EMD and supporting documents before making a bid decision.
                                  </p>
                                </div>
                                <button onClick={() => navigate('Eligibility Checker')} className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2.5 text-xs font-semibold text-cyan-200">
                                  Review eligibility <ArrowRight size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center">
                    <span className="text-[10px] text-slate-500">Showing {tenders.length} sample opportunities</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <ShieldCheck size={13} className="text-cyan-300" /> Demo records · Verify official tender details
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.06] py-5 text-[10px] text-slate-600 sm:flex-row sm:items-center">
            <span>© 2026 Tender Saathi Pro · Tender Intelligence for Small Businesses</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Prototype · Sample data only</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
