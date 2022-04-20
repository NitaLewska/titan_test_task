let lineDiv = document.getElementById("line-chart");

/* Настройка времени от 00:00 до 23:59 */

let time = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j <= 59; j++) {
    if (j < 10) {
      time.push("0" + i + ":0" + j);
    } else {
      time.push("0" + i + ":" + j);
    }
  }
}
for (let i = 10; i <= 23; i++) {
  for (let j = 0; j <= 59; j++) {
    if (j < 10) {
      time.push("" + i + ":0" + j);
    } else {
      time.push("" + i + ":" + j);
    }
  }
}

/* План добычи*/

let extractionPlan = {
  y: [],
  x: time,
  name: "План добычи",
  fill: "tozeroy",
  type: "scatter",
  fillcolor: "#B6E2FF50",
  line: {
    color: "#6CC5FF",
  },
};

/* targetRate - величина плана добычи  */

let targetRate = 0;
if (localStorage.getItem("targetRate")) {
  targetRate = localStorage.getItem("targetRate");
}

/* y=targetRate */

for (let i = 0; i < time.length; i++) {
  extractionPlan.y[i] = targetRate;
}

/* Добыча (в час) */
/* Этот график не строится, но используется в расчетах */
let extractionHour = {
  y: [],
  x: time,
  type: "scatter",
  mode: "markers",
  name: "Добыто (час)",
  width: 15,
};

/* y=0 */
for (let i = 0; i < time.length; i++) {
  if (!extractionHour.y[i]) {
    extractionHour.y[i] = 0;
  }
}

/* Разница за каждый час */
let extractionHourAdded = {
  y: [],
  x: time,
  type: "bar",
  name: "Добыто (час)",
  width: 45,
  marker: {
    color: "#7CFC00",
  },
};

/* Добыча (в день) промежуточные вычисления*/

let extractionDay = {
  x: time,
  y: [extractionHour.y[0]],
  type: "scatter",
  name: "Добыто (сутки)",
};

for (let i = 1; i <= extractionHour.x.length; i++) {
  extractionDay.y.push(extractionDay.y[i - 1] + extractionHour.y[i]);
}

/* Добыча (в день) график*/

let extractionDayGraph = {
  x: [],
  y: [],
  type: "scatter",
  name: "Добыто (сутки)",
};

/*Прогноз добычи*/

let interpolation = 0;
let interpolation_start = 0;

let extraction_interpolation = {
  x: time,
  y: [],
  type: "scatter",
  name: "Прогноз добычи",
  line: {
    dash: "dot",
    width: 4,
    color: "#6CC5FF",
  },
};

/* Список графиков для построения */

let data = [
  extractionPlan,
  extraction_interpolation,
  extractionDayGraph,
  extractionHourAdded,
];

/* Настройка внешнего вида координатной плоскости */

let layout = {
  title: "Скважина 1-1",
  font: {
    family: "Lato",
    size: 14,
    color: "rgb(100,150,200)",
  },
  plot_bgcolor: "#FFF",
  margin: {
    pad: 10,
  },
  xaxis: {
    rangemode: "tozero",
    dtick: 120,
    tick0: "00:00",
    size: 12,
  },
  yaxis: {
    title: "Дебит",
    titlefont: {
      color: "black",
      size: 16,
    },
    rangemode: "tozero",
  },
  legend: {
    y: 5,
    orientation: "h",
  },
};

let config = { responsive: true };

/* Вызов Plotly */

Plotly.plot(
  lineDiv,
  data,
  layout,
  config,
  { scrollZoom: true },
  { displaylogo: false }
);

/* Ввод данных */

/* План добычи */
document.querySelector("#btn_plan").addEventListener("click", function (e) {
  e.preventDefault();
  targetRate = document.querySelector("#input_plan").value;
  localStorage.setItem("targetRate", targetRate);

  /* пересчет всех точек плана добычи */
  for (let i = 0; i < time.length; i++) {
    extractionPlan.y[i] = targetRate;
  }

  /* перекрас графика прогноза */
  if (extraction_interpolation.y[time.length - 1] >= targetRate) {
    extraction_interpolation.line.color = "#47FF6C";
  } else {
    extraction_interpolation.line.color = "red";
  }
  Plotly.redraw(lineDiv);
});

/* Добавить/изменить точку */
document.querySelector("#btn_add").addEventListener("click", function (e) {
  e.preventDefault();
  let xNew = time.indexOf(document.querySelector("#time_new").value);
  let yNew = document.querySelector("#extracted_new").value;
  extractionHour.y[xNew] = yNew;
  for (let i = 1; i <= extractionHour.x.length; i++) {
    extractionDay.y[i] =
      parseInt(extractionDay.y[i - 1]) + parseInt(extractionHour.y[i]);
  }
  /* пересчёт графика прогноза добычи */
  for (let i = 0; i < time.length; i++) {
    if (extractionHour.y[i] != 0) {
      interpolation = extractionDay.y[i] / i;
      interpolation_start = i;
    }
  }
  extractionDayGraph.y = [];
  extractionDayGraph.x = [];

  /* пересчет прочих графиков */
  for (let i = 1; i <= time.length; i++) {
    if (extractionDay.y[i] != extractionDay.y[i - 1]) {
      extractionDayGraph.y.push(extractionDay.y[i]);
      extractionDayGraph.x.push(time[i]);
    }
  }

  for (let i = 60; i <= time.length; i = i + 60) {
    extractionHourAdded.y[i - 30] =
      extractionDay.y[i] - extractionDay.y[i - 60];
  }

  extraction_interpolation.y = [];

  for (let i = interpolation_start; i < time.length; i++) {
    extraction_interpolation.y[i] = Math.round(interpolation * i);
  }
  /* перекрас графика прогноза добычи */
  if (extraction_interpolation.y[time.length - 1] >= targetRate) {
    extraction_interpolation.line.color = "#47FF6C";
  } else {
    extraction_interpolation.line.color = "red";
  }
  Plotly.redraw(lineDiv);
  document.querySelector("#time_new").value = 0;
  document.querySelector("#extracted_new").value = 0;
});

/*кнопка сброса*/

document.querySelector("#btn_clear").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  location.reload();
  return false;
});
