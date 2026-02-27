import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

export const DocLinkBtn = ({ href, children }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-100 hover:text-blue-800 border border-blue-200 shadow-sm"
        >
            <FileText size={16} />
            {children}
            <ExternalLink size={14} className="ml-1 opacity-70" />
        </a>
    );
};
