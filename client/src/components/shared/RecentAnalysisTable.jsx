import React from 'react';
import { Eye } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const RecentAnalysisTable = ({ data, onRowClick }) => {
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="w-full overflow-x-auto border border-border-dark rounded-lg bg-bg-charcoal">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-dark bg-bg-surface">
            <th className="px-5 py-3 text-[11px] font-semibold text-text-sec uppercase tracking-wider">Type</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-text-sec uppercase tracking-wider">Date</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-text-sec uppercase tracking-wider">Result</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-text-sec uppercase tracking-wider">Status</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-text-sec uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-dark">
          {data.map((item) => {
            const isThermal = item.peopleDetected !== undefined;
            const type = isThermal ? 'Thermal' : 'Building Damage';
            
            let resultText = '';
            if (isThermal) {
              resultText = `${item.peopleDetected} people detected`;
            } else {
              resultText = `${item.damagedBuildings} / ${item.totalBuildings} damaged`;
            }

            return (
              <tr 
                key={item._id} 
                className="hover:bg-brand/5 transition-colors group cursor-pointer"
                onClick={() => onRowClick && onRowClick(item, isThermal ? 'thermal' : 'damage')}
              >
                <td className="px-5 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-bg-surface text-text-main border-border-dark">
                    {type}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-text-sec">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-5 py-3 text-[13px] text-text-main font-medium">
                  {resultText}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status="COMPLETED" type="default" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-text-muted group-hover:text-brand transition-colors flex items-center justify-end gap-1.5 ml-auto text-[13px] font-medium">
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentAnalysisTable;
