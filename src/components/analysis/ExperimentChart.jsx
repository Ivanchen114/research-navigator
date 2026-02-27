import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const ExperimentChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 50,
                max: 100,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    const data = {
        labels: ['前測', '後測'],
        datasets: [
            {
                label: '實驗組 (聽音樂)',
                data: [65, 85],
                borderColor: '#9333ea', // purple-600
                backgroundColor: '#9333ea',
                tension: 0.1,
            },
            {
                label: '控制組 (安靜)',
                data: [64, 70],
                borderColor: '#94a3b8', // slate-400
                backgroundColor: '#94a3b8',
                tension: 0.1,
            },
        ],
    };

    return <Line options={options} data={data} />;
};
