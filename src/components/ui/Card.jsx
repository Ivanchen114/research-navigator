import React from 'react';
import classNames from 'classnames';

export const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={classNames(
                "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className, ...props }) => {
    return (
        <div
            className={classNames("px-6 py-4 border-b border-slate-100", className)}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className, ...props }) => {
    return (
        <h3
            className={classNames("text-lg font-bold text-slate-800", className)}
            {...props}
        >
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className, ...props }) => {
    return (
        <div
            className={classNames("p-6", className)}
            {...props}
        >
            {children}
        </div>
    );
};
