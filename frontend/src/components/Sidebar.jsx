import {
  LayoutDashboard,
  LineChart,
  Brain,
  BriefcaseBusiness,
  Settings
} from "lucide-react";

function Sidebar() {

  const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    id: "top"
  },
  {
    title: "Analytics",
    icon: <LineChart size={20} />,
    id: "analytics"
  },
  {
    title: "AI Forecasts",
    icon: <Brain size={20} />,
    id: "forecast"
  },
  {
    title: "Portfolio",
    icon: <BriefcaseBusiness size={20} />,
    id: "portfolio"
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    id: "top"
  }
];

  return (
    <div className="w-[260px] h-screen bg-slate-950 border-r border-slate-800 p-6 flex flex-col">

      <h1 className="text-2xl font-bold text-white mb-12">
        QuantAI Analytics
      </h1>

      <div className="space-y-4">

        {menuItems.map((item, index) => (

          <div
          onClick={() => {
  const section = document.getElementById(item.id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}}
            key={index}
            className="flex items-center gap-4 text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-300 cursor-pointer p-3 rounded-xl"
          >

            {item.icon}

            <p className="text-md font-medium">
              {item.title}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;