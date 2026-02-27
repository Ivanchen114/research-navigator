import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const PromptBox = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Assuming children is a simple string for this prototype.
        // In reality, it might need to extract text content if children are complex nodes.
        let textToCopy = '';
        if (typeof children === 'string') {
            textToCopy = children;
        } else if (Array.isArray(children)) {
            textToCopy = children.map(c => typeof c === 'string' ? c : '').join('');
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="group relative bg-[#f1f5f9] border-l-4 border-blue-500 rounded-r-lg my-2">
            <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-800 whitespace-pre-wrap">
                {children}
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-blue-600 focus:outline-none"
                title="複製指令"
            >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
            {copied && (
                <div className="absolute top-2 right-12 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                    ✅ 已複製！
                </div>
            )}
        </div>
    );
};

export const AIInstructionDropdown = ({ title, children }) => {
    return (
        <details className="group border border-slate-200 rounded-lg bg-slate-50 overflow-hidden mt-4">
            <summary className="font-semibold text-slate-700 p-3 cursor-pointer hover:bg-slate-100 transition-colors list-none flex justify-between items-center group-open:bg-blue-50 group-open:text-blue-700">
                <span>🤖 點擊展開 AI 指令：{title}</span>
                <span className="text-xl group-open:rotate-45 transition-transform duration-200">+</span>
            </summary>
            <div className="p-3 pt-0 border-t border-slate-200 bg-white">
                {children}
            </div>
        </details>
    )
}
