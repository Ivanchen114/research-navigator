import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Reusable Copy Button for Prompts
 * @param {string} text - The text to copy to clipboard
 * @param {string} label - The label for the button
 * @param {string} className - Optional extra classes
 */
const CopyButton = ({ text, label = "複製這段 Prompt", className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white border border-white/15 rounded-[5px] text-[12px] transition-all cursor-pointer ${className}`}
        >
            {copied ? (
                <>
                    <Check size={14} className="text-green-400" />
                    <span>已複製！</span>
                </>
            ) : (
                <>
                    <Copy size={14} />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
};

export default CopyButton;
