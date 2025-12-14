import React from "react";

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className={`rounded-lg shadow-md p-6 ${color.bg} ${color.hover} hover:scale-[1.02] cursor-pointer`}>
    <div className="flex items-center">
      <div className={`${color} p-3 rounded-full`}>
        <Icon className={`w-8 h-8 ${color.text}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default StatsCard;
