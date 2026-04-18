import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export const FoundationChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: '花費 (元)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '成績',
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: '看似正相關 (但可能有干擾變項)',
            },
        },
    };

    const data = {
        datasets: [
            {
                label: '早餐花費 vs 成績',
                data: [
                    { x: 50, y: 70 },
                    { x: 60, y: 85 },
                    { x: 45, y: 65 },
                    { x: 100, y: 90 },
                    { x: 80, y: 88 },
                    { x: 30, y: 60 },
                    { x: 120, y: 95 },
                    { x: 55, y: 75 },
                    { x: 90, y: 82 },
                    { x: 40, y: 55 },
                ],
                backgroundColor: '#2d5be3', // Version A Accent Blue
            },
        ],
    };

    return <Scatter options={options} data={data} />;
};
