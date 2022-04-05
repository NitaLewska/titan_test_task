var lineDiv = document.getElementById("line-chart");

let time = []
for(let i=0; i<=10; i++) {
  for(let j=0; j<=59; j++) {
    if (j<10) {
      time.push("0"+i+":0"+j)  
    }else{
      time.push("0"+i+":"+j)
    }
  }
}
for(let i=10; i<=23; i++) {
  for(let j=0; j<=59; j++) {
    if (j<10) {
      time.push(""+i+":0"+j)  
    }else{
      time.push(""+i+":"+j)
    }
  }
}

var extractionPlan = {
    y: [],
    x: time,
    name:"План добычи",
    fill: 'tozeroy',
    type: 'scatter'
}

let targetRate = 100

for (let i=0; i<time.length; i++) {
  extractionPlan.y[i] = targetRate;
} 

let extractionHour = {
  y: [0, 23, 0, 0, 30, 1, 30, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 89, 0, 0, 0],
  x: time,
  type: "bar",
  name:"Добыто (час)"
};
for (let i=0; i<time.length; i++) {
  if (!extractionHour.y[i]) {
    extractionHour.y[i] = 0
  }
} 

let extractionDay = {
  x: time,
  y: [extractionHour.y[0]],
  type: "scater",
  name:"Добыто (сутки)"
};

for (let i=1; i<=extractionHour.x.length; i++) {
    extractionDay.y.push(extractionDay.y[i-1]+extractionHour.y[i])
}

var data = [extractionHour, extractionDay, extractionPlan];

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


/* Ввод данных */

btnPlan = document.querySelector("#btn_plan")
btnPlan.addEventListener('click', function(e) {
  e.preventDefault()
  targetRate = document.querySelector("#input_plan").value
  for (let i=0; i<time.length; i++) {
    extractionPlan.y[i] = targetRate;
  } 
  Plotly.redraw(lineDiv)
})

btnAdd = document.querySelector("#btn_add")
btnAdd.addEventListener('click', function(e) {
  e.preventDefault()
  let xNew = time.indexOf(document.querySelector('#time_new').value)
  let yNew = document.querySelector("#extracted_new").value
  extractionHour.y[xNew] = yNew;
  for (let i=1; i<=extractionHour.x.length; i++) {
    extractionDay.y[i]=(parseInt(extractionDay.y[i-1])+parseInt(extractionHour.y[i]))
  }
  Plotly.redraw(lineDiv)
document.querySelector('#time_new').value = 0
document.querySelector("#extracted_new").value = 0

})