import { Search, Bell, UserCircle2 } from "lucide-react";

function Topbar({
  ticker,
  setTicker,
  fetchStock
}) {

  return (

    <div className="flex items-center justify-between mb-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          AI Portfolio Intelligence
        </h1>

        <p className="text-slate-400 mt-1">
          Quantitative analytics & AI forecasting
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 w-[320px]">

          <Search size={18} className="text-slate-400" />

        <input
  type="text"
  value={ticker}
  onChange={(e) =>
    setTicker(e.target.value.toUpperCase())
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      fetchStock();
    }
  }}
  placeholder="Search stocks..."
  className="bg-transparent outline-none ml-3 text-white w-full"
/>

        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">

          <Bell size={20} />

        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">

          <UserCircle2 size={20} />

        </div>

      </div>

    </div>
  );
}

export default Topbar;