//TODO: Modularizar o código
async function getData() {
  const response = await fetch("coleguinhas_raw");
  const text = await response.text();
  const regex = /([A-Z][A-Z ]+[A-Z])[ \|]+([\d,]+\d)[ \|]+([\d,]+\d)[ \|]+([\d,]+\d)[ \|]+([\d,]+\d)[ \|]+([\d,]+\d)[ \|]+([\d,]+\d)[ \|]+([\d]+\d)[ \|]+([A-Z][A-Z ]+[A-Z])/g;
  if (regex.test(text)) {
    let matches_iter = text.matchAll(regex);
    let matches = Array.from(matches_iter);
    let coleguinhas = [];
    for(let i=0; i < matches.length; i++) {
      let m = matches[i];
      let coleguinha = {
        "Nome": m[1],
        "Média primeira fase": parseFloat(m[2]),
        "MAT": parseFloat(m[3]),
        "FIS": parseFloat(m[4]),
        "QUIM": parseFloat(m[5]),
        "RED": parseFloat(m[6]),
        "Média final": parseFloat(m[7]),
        "Classificação": parseInt(m[8]),
        "Cidade": m[9]
      };
      coleguinhas.push(coleguinha);
    }
    return coleguinhas;
  }
  else {
      console.error("No matches found!");
      return null;
    }
}

async function plotData() {
  //Receber os dados
  const dados = await getData();
  let identificadores = ["Média primeira fase", "MAT", "FIS", "QUIM", "RED", "Média final"];
  let notas = {};
  for(let id of identificadores) {
    notas[id] = [];
  }
  for(let coleguinha of dados) {
    for(let id of identificadores) {
      notas[id].push(coleguinha[id]);
    }
  }
  console.debug(notas["MAT"]);

  function plot_grades(subject, rawdata, fill_color, border_color) {
    let div = document.createElement("div");
    div.id = `Notas ${subject}`;
    div.class = "grid-item";
    div.style.width = "400px";
    div.style.height = "400px";
    div.style.backgroundColor = "black";
    document.getElementById("Histogramas").append(div);
    let histograma = {
      x: rawdata,
      type: 'histogram',
      marker: {
        color: fill_color,
        line: {
          color:  border_color,
          width: 1
        }
      }
    };
    let layout = {
      //bargap: 0.05, Desnecessário
      //bargroupgap: 0.2,
      barmode: "overlay",
      title: subject,
      xaxis: {
        title: "Nota",
        range: [0,10],
        autotick: false,
        ticks: 'outside',
        tick0: 0,
        dtick: 1.0
      },
      yaxis: {title: "Frequência"},
    };
    Plotly.newPlot(div.id, [histograma], layout);
  }
  //TODO: usar cores com nomes mais intuitivos
  plot_grades("Média primeira fase", notas["Média primeira fase"], "rgba(60, 240, 240, 0.7)", "rgba(240, 240, 240, 1)");
  plot_grades("MAT", notas["MAT"], "rgba(100, 200, 102, 0.7)", "rgba(100, 200, 102, 1)");
  plot_grades("FIS", notas["FIS"], "rgba(220, 100, 52, 0.7)", "rgba(220, 100, 52, 1)");
  plot_grades("QUIM", notas["QUIM"], "rgba(220, 220, 32, 0.7)", "rgba(220, 220, 32, 1)");
  plot_grades("RED", notas["RED"], "rgba(120, 0, 252, 0.7)", "rgba(100, 0, 252, 1)");
  plot_grades("Média final", notas["Média final"], "rgba(250, 50, 252, 0.7)", "rgba(250, 50, 252, 1)");
  //Dados para o gráfico de pizza
  //TODO: desmistificar esse código
  contagem = {}
  for(let coleguinha of dados) {
    let c = coleguinha["Cidade"]
    contagem[c] = (contagem[c] || 0) + 1;
  }
  //Plotar gráfico de pizza
  //TODO: fazer um layout mais dinâmico
  let div2 = document.createElement("div");
  div2.id = `cidades`;
  document.getElementById("Gráfico de pizza").append(div2);
  let pie_chart = [{
    values: Object.values(contagem),
    labels: Object.keys(contagem),
    type:'pie'
  }];
  let layout = {
    height: 800,
    width: 800,
    title: "Percentual de cada cidade"
  };
  Plotly.newPlot(div2.id, pie_chart, layout);
}

plotData();