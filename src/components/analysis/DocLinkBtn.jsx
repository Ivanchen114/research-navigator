import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

export const DocLinkBtn = ({ href, children }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a2e] px-4 py-2 rounded-[2px] text-[12px] font-bold transition-all hover:bg-[#1a1a2e] hover:text-white border border-[#1a1a2e] shadow-sm font-['DM_Mono',monospace] uppercase tracking-wider"
        >
            <FileText size={14} />
            {children}
            <ExternalLink size={12} className="ml-1 opacity-50" />
        </a>
    );
};
