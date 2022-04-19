let lineDiv = document.getElementById("line-chart");

/* Настройка времени от 00:00 до 23:59 */

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

/* План добычи*/

let extractionPlan = {
    y: [],
    x: time,
    name:"План добычи",
    fill: 'tozeroy',
    type: 'scatter'
}

/* targetRate - величина плана добычи  */

let targetRate = 100
if(localStorage.getItem('targetRate')){
  targetRate = localStorage.getItem('targetRate')
}


/* y=targetRate */

for (let i=0; i<time.length; i++) {
  extractionPlan.y[i] = targetRate;
} 

/* Добыча (в час) */

let extractionHour = {
  y: [],
  x: time,
  type: "bar",
  name:"Добыто (час)"
};

/* y=0 */

for (let i=0; i<time.length; i++) {
  if (!extractionHour.y[i]) {
    extractionHour.y[i] = 0
  }
} 

/* Добыча (в день) */

let extractionDay = {
  x: time,
  y: [extractionHour.y[0]],
  type: "scater",
  name:"Добыто (сутки)"
};

for (let i=1; i<=extractionHour.x.length; i++) {
    extractionDay.y.push(extractionDay.y[i-1]+extractionHour.y[i])
}

let interpolation = 0
let interpolation_start = 0

let extraction_interpolation ={
  x: time,
  y: [],
  type: "scater",
  name: "www",
  line: {
    dash: 'dot',
    width: 4
  }
}

/* Список графиков для построения */

let data = [extractionHour, extractionDay, extractionPlan, extraction_interpolation];

/* Настройка внешнего вида графиков */

let layout = {
  title: "Скважина 1-1",
  height: 500,
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
    tick0: "00:00",
  },
  yaxis: {
    title: "Дебит",
    titlefont: {
      color: "black",
      size: 16,
    },
    rangemode: "tozero",
  },
  legend: {"orientation": "h"}
};

let config = { responsive: true };

/* Вызов Plotly */

Plotly.plot(lineDiv, data, layout, config, {scrollZoom: true}, {displaylogo: false});


/* Ввод данных */

/* План добычи */
document.querySelector("#btn_plan").addEventListener('click', function(e) {
  e.preventDefault()
  targetRate = document.querySelector("#input_plan").value
  localStorage.setItem('targetRate', targetRate)
  for (let i=0; i<time.length; i++) {
    extractionPlan.y[i] = targetRate;
  } 
  Plotly.redraw(lineDiv)
})

/* Добавить/изменить точку */
document.querySelector("#btn_add").addEventListener('click', function(e) {
  e.preventDefault()
  let xNew = time.indexOf(document.querySelector('#time_new').value)
  let yNew = document.querySelector("#extracted_new").value
  extractionHour.y[xNew] = yNew;
  for (let i=1; i<=extractionHour.x.length; i++) {
    extractionDay.y[i]=(parseInt(extractionDay.y[i-1])+parseInt(extractionHour.y[i]))
  }
  for (let i=0; i<time.length; i++) {
    if (extractionHour.y[i] != 0) {
      interpolation = extractionDay.y[i]/i
      interpolation_start = i
    }
  }
  extraction_interpolation.y=[]

  for (let i=interpolation_start; i<time.length; i++) {
    extraction_interpolation.y[i] = interpolation*i
  }
  Plotly.redraw(lineDiv)
document.querySelector('#time_new').value = 0
document.querySelector("#extracted_new").value = 0

})

document.querySelector("#btn_clear").addEventListener('click', function(e) {
  e.preventDefault()
  localStorage.clear()
  location.reload();
  return false;
})