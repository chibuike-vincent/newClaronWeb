import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";



function BookingGraph() {

    let chartRef = useRef()

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            data: [86, 114, 106, 106, 107, 111, 133, 190, 180, 112,171,80],
            label: "Total",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: [70, 90, 44, 60, 83, 90, 100, 40, 120, 10, 98,31],
            label: "Accepted",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
          {
            data: [10, 21, 60, 44, 17, 21, 17, 27,82,43,12,40],
            label: "Pending",
            borderColor: "#ffa500",
            backgroundColor: "#ffc04d",
            fill: false,
          },
          {
            data: [6, 3, 2, 2, 7, 0, 16,2,8,2,4,9],
            label: "Rejected",
            borderColor: "#c45850",
            backgroundColor: "#d78f89",
            fill: false,
          },
        ],
      },
    });
  }, []);

  return (
    <div>
      <canvas id="myChart" ref={chartRef} />
    </div>
  );
}

export default BookingGraph;
