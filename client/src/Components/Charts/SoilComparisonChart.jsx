import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SoilComparisonChart = ({ data }) => {
  // Get unique locations
  const locations = [...new Set(data.map((item) => item.location))];

  // Calculate averages for each location
  const locationData = locations.map((location) => {
    const locationItems = data.filter((item) => item.location === location);
    const avgPh =
      locationItems.reduce((sum, item) => sum + item.ph, 0) /
      locationItems.length;
    const avgMoisture =
      locationItems.reduce((sum, item) => sum + item.moisture, 0) /
      locationItems.length;
    const avgEc =
      locationItems.reduce((sum, item) => sum + item.ec, 0) /
      locationItems.length;
    const avgTemp =
      locationItems.reduce((sum, item) => sum + item.temperature, 0) /
      locationItems.length;

    return {
      location,
      avgPh: avgPh.toFixed(2),
      avgMoisture: avgMoisture.toFixed(1),
      avgEc: avgEc.toFixed(2),
      avgTemp: avgTemp.toFixed(1),
    };
  });

  const chartData = {
    labels: locations,
    datasets: [
      {
        label: "pH Level",
        data: locationData.map((item) => item.avgPh),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Moisture (%)",
        data: locationData.map((item) => item.avgMoisture),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
      {
        label: "Temperature (°C)",
        data: locationData.map((item) => item.avgTemp),
        backgroundColor: "rgba(245, 158, 11, 0.8)",
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
        yAxisID: "y1",
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
        text: "Soil Parameters by Location",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "pH Level",
        },
        min: 0,
        max: 14,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Moisture (%) / Temperature (°C)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SoilComparisonChart;
