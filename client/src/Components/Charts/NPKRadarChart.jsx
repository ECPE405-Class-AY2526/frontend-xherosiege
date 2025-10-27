import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const NPKRadarChart = ({ latestData }) => {
  // Calculate average NPK values from latest readings
  const avgNPK = latestData.reduce(
    (acc, item) => {
      if (item.npk) {
        acc.nitrogen += item.npk.nitrogen || 0;
        acc.phosphorus += item.npk.phosphorus || 0;
        acc.potassium += item.npk.potassium || 0;
        acc.count++;
      }
      return acc;
    },
    { nitrogen: 0, phosphorus: 0, potassium: 0, count: 0 }
  );

  const data = {
    labels: [
      "Nitrogen (N)",
      "Phosphorus (P)",
      "Potassium (K)",
      "pH Level",
      "Moisture",
      "EC",
    ],
    datasets: [
      {
        label: "Current Soil Health",
        data: [
          avgNPK.count > 0 ? (avgNPK.nitrogen / avgNPK.count).toFixed(1) : 0,
          avgNPK.count > 0 ? (avgNPK.phosphorus / avgNPK.count).toFixed(1) : 0,
          avgNPK.count > 0 ? (avgNPK.potassium / avgNPK.count).toFixed(1) : 0,
          latestData.length > 0 ? latestData[0].ph : 0,
          latestData.length > 0 ? latestData[0].moisture : 0,
          latestData.length > 0 ? latestData[0].ec : 0,
        ],
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 197, 94, 1)",
      },
      {
        label: "Optimal Range",
        data: [100, 50, 200, 7, 60, 1.5], // Typical optimal values
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        pointBackgroundColor: "rgba(59, 130, 246, 0.5)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
        borderDash: [5, 5],
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
        text: "Soil Health Radar - NPK & Parameters",
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 250,
        ticks: {
          stepSize: 50,
        },
        grid: {
          color: "#374151",
        },
        angleLines: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default NPKRadarChart;
