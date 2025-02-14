const sectionClimas = document.querySelector(".climas");

const getMonedasDelJson = async () => {
  try {
    const res = await fetch("./climas.json");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

getMonedasDelJson();


const apiURL = "https://api.gael.cloud/general/public/clima";

async function renderClimas() {
  try {
    const res = await fetch(apiURL);
    const climas = await res.json();
    let template = "";
    climas.forEach((clima) => {
      template += `
      <div class="clima">
      <h3>${clima.Estacion}</h3>
      <p>${clima.Temp}°C</p>
      <p>${
        clima.Estado === "Nublado"
          ? "<img src='https://cdn-icons-png.freepik.com/256/16273/16273785.png?semt=ais_hybrid'/>"
          : "<img src='https://images.vexels.com/media/users/3/145136/isolated/lists/94a70b169da2d2f32dc34ead9122ef2d-grande-icone-de-raios-nitidos-de-sol.png'/>"
      }</p>
      </div>
      `;
    });
    sectionClimas.innerHTML = template;
  } catch (error) {
    sectionClimas.innerHTML = `<p>Hubo un error al cargar los datos</p>`;
  }
}

renderClimas();

const apiURL2 = "https://api.gael.cloud/general/public/sismos";

async function getAndCreateDataToChart() {
  const res = await fetch(apiURL2);
  const sismos = await res.json();
  const labels = sismos.map((sismo) => {
    return sismo.Fecha;
  });
  const data = sismos.map((sismo) => {
    const magnitud = sismo.Magnitud.split(" ")[0];
    return Number(magnitud);
  });
  const datasets = [
    {
      label: "Sismo",
      borderColor: "rgb(72, 39, 205)",
      backgroundColor: "red",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGrafica() {
  const data = await getAndCreateDataToChart();
  const config = {
    type: "line",
    data,
  };
  const myChart = document.getElementById("myChart");

  new Chart(myChart, config);
}

renderGrafica();

async function getMonedas() {
  try {
    const endpoint = "https://api.gael.cloud/general/public/monedas";
  const res = await fetch(endpoint);
  const monedas = await res.json();
  return monedas;
  } catch (error) {
    console.log(error);
  }
}

function prepararConfiguracionParaLaGrafica(monedas) {
  // Creamos las variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";
  const nombresDeLasMonedas = monedas.map((moneda) => moneda.Codigo);
  //quitar los dos primeros items del array nombresDeLasMonedas
  const titulo = "Monedas";
  const colorDeLinea = "red";
  const valores = monedas.map((moneda) => {
    const valor = moneda.Valor.replace(",", ".");
    return Number(valor);
  });
  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombresDeLasMonedas,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}

async function renderGrafica2() {
  const monedas = await getMonedas();
  const config = prepararConfiguracionParaLaGrafica(monedas);
  const chartDOM = document.getElementById("myChart2");
  new Chart(chartDOM, config);
}
renderGrafica2();
