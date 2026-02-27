import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const SurveyChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
        labels: ['高一', '高二'],
        datasets: [
            {
                label: '社團投入時數 (小時/週)',
                data: [2.5, 4.2],
                backgroundColor: '#3b82f6',
            },
            {
                label: '滿意度 (1-5分)',
                data: [3.8, 3.5],
                backgroundColor: '#94a3b8',
            },
        ],
    };

    return <Bar options={options} data={data} />;
};
