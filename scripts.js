var lineDiv = document.getElementById("line-chart");

var extraction_plan = {
    y: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,100, 100 ],
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
}

var extraction_hour = {
  y: [0, 0, 0, 0, 30, 1, 30, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  type: "bar",
};

var extraction_day = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  y: [extraction_hour.y[0]],
  type: "scater",
};

/* var extraction_plan = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    y: [extraction_hour.y[0]],
    type: "scater",
  };

extraction_plan.y[25] = extraction_day.y.24/  */ 

for (let i=1; i<=extraction_hour.x.length; i++) {
    extraction_day.x.push(extraction_hour.x[i])
    extraction_day.y.push(extraction_day.y[i-1]+extraction_hour.y[i])
}

var data = [extraction_hour, extraction_day, extraction_plan];

var layout = {
  title: "Скважина 1-1",
  height: 550,
  font: {
    family: "Lato",
    size: 16,
    color: "rgb(100,150,200)",
  },
  plot_bgcolor: "rgba(200,255,0,0.1)",
  margin: {
    pad: 10,
  },
  xaxis: {
    title: "Distance travelled along x-axis",
    titlefont: {
      color: "black",
      size: 12,
    },
    rangemode: "tozero",
  },
  yaxis: {
    title: "Дебит",
    titlefont: {
      color: "black",
      size: 12,
    },
    rangemode: "tozero",
  },
};

Plotly.plot(lineDiv, data, layout);
