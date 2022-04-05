var lineDiv = document.getElementById("line-chart");

let time = []
for(let i=0; i<=23; i++) {

  for(let j=0; j<=59; j++) {
    if (j<10) {
      time.push(""+i+":0"+j)  
    }else{
      time.push(""+i+":"+j)
    }
  }
}

var extraction_plan = {
    y: [],
    x: time,
    name:"План добычи",
    fill: 'tozeroy',
    type: 'scatter'
}

let target_rate = 100

for (let i=0; i<time.length; i++) {
  extraction_plan.y[i] = target_rate;
} 

var extraction_hour = {
  y: [0, 23, 0, 0, 30, 1, 30, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 89, 0, 0, 0],
  x: time,
  type: "bar",
  name:"Добыто (час)"
};

var extraction_day = {
  x: time,
  y: [extraction_hour.y[0]],
  type: "scater",
  name:"Добыто (сутки)"
};

/* var extraction_plan = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    y: [extraction_hour.y[0]],
    type: "scater",
  };

extraction_plan.y[25] = extraction_day.y.24/  */ 

for (let i=1; i<=extraction_hour.x.length; i++) {
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
    rangemode: "tozero",
    dtick: 60,
    tick0: "0:0",
  },
  yaxis: {
    title: "Дебит",
    titlefont: {
      color: "black",
      size: 12,
    },
    rangemode: "tozero",
  },
  legend: {"orientation": "h"}
};

var config = { responsive: true };

Plotly.plot(lineDiv, data, layout, config, {scrollZoom: true});
