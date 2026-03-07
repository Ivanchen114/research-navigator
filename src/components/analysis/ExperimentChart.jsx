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
                borderColor: '#2d5be3', // Version A Accent Blue
                backgroundColor: '#2d5be3',
                tension: 0.1,
            },
            {
                label: '控制組 (安靜)',
                data: [64, 70],
                borderColor: '#c9a84c', // Version A Gold
                backgroundColor: '#c9a84c',
                tension: 0.1,
            },
        ],
    };

    return <Line options={options} data={data} />;
};
