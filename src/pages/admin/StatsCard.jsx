import React from "react";

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className={`rounded-xl shadow-sm border border-gray-100 p-5 ${color.bg} ${color.hover} transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-xl ${color.bg}`}>
        <Icon className={`w-7 h-7 ${color.text}`} />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default StatsCard;
