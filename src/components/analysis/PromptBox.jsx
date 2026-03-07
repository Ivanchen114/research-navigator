import React, { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';

export const PromptBox = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
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
        <div className="group relative bg-[#1a1a2e] border-l-4 border-[#c9a84c] rounded-[2px] my-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/5">
                <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-[0.2em] font-['DM_Mono',monospace]">AI Prompt Module</span>
                <button
                    onClick={handleCopy}
                    className="p-1 px-2 flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-[10px] font-bold font-['DM_Mono',monospace]"
                >
                    {copied ? <Check size={12} className="text-[#2e7d5a]" /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY'}
                </button>
            </div>
            <pre className="p-6 overflow-x-auto text-[13px] font-['DM_Mono',monospace] text-white/90 whitespace-pre-wrap leading-relaxed selection:bg-[#c9a84c]/30">
                {children}
            </pre>
            {copied && (
                <div className="absolute top-10 right-4 animate-in fade-in slide-in-from-top-1">
                    <div className="text-[10px] font-bold text-[#2e7d5a] bg-[#e8fff3] px-2 py-0.5 rounded-[2px] border border-[#c1e6d1]">
                        SUCCESS
                    </div>
                </div>
            )}
        </div>
    );
};

export const AIInstructionDropdown = ({ title, children }) => {
    return (
        <details className="group border border-[#dddbd5] rounded-[4px] bg-[#f8f7f4] overflow-hidden mt-6 transition-all duration-300 open:border-[#1a1a2e] open:shadow-lg">
            <summary className="font-bold text-[13px] text-[#1a1a2e] p-4 cursor-pointer hover:bg-white transition-colors list-none flex justify-between items-center group-open:bg-[#1a1a2e] group-open:text-white">
                <span className="flex items-center gap-3">
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-current/10 rounded-full text-[10px]">🤖</span>
                    展開分析指令：{title}
                </span>
                <ChevronDown size={14} className="transition-transform duration-300 group-open:rotate-180 opacity-50" />
            </summary>
            <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                {children}
            </div>
        </details>
    )
}
