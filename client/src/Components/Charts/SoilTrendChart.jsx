import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SoilTrendChart = ({ data, parameter, color = "#8884d8", unit = "" }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((item) =>
      new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: `${parameter} ${unit}`,
        data: data.map((item) => {
          // Handle nested NPK values
          if (parameter.includes(".")) {
            const [parent, child] = parameter.split(".");
            return item[parent]?.[child];
          }
          return item[parameter];
        }),
        borderColor: color,
        backgroundColor: color + "20",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${parameter} Trend Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "#374151",
        },
      },
      x: {
        grid: {
          color: "#374151",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SoilTrendChart;
