class CovidCounty {
  constructor(timeline) {
    this.timeline = timeline // array of { date: String, cases: Int, deaths: Int }
  }

  get dates() { return this.timeline.map(d => d.date) }
  get cumulativeCases() { return this.timeline.map(d => d.cases) }
  get cumulativeDeaths() { return this.timeline.map(d => d.deaths) }

  get cases() {
    return this.timeline.map((d,i,a) => i < 1 ? parseInt(d.cases, 10) : parseInt(d.cases, 10) - parseInt(a[i-1].cases))
  }

  get deaths() {
    return this.timeline.map((d,i,a) => i < 1 ? parseInt(d.deaths, 10) : parseInt(d.deaths, 10) - parseInt(a[i-1].deaths))
  }
}

const line_colors = ['red', 'green', 'blue', 'purple', 'orange', 'brown', 'black'];

async function getCountyTimeline(county) {
  let json = await fetch(`json/${county}.json`).then(resp => resp.json());
  return new CovidCounty(json);
};

window.addEventListener('DOMContentLoaded', (event) => {
  let params = (new URL(document.location)).searchParams;
  let counties = params.getAll('c');
  if (counties.length == 0) counties.push('Illinois/Cook');
  while (counties.length > line_colors) counties.pop();
  let timeline_promises = counties.map((c) => getCountyTimeline(c));
  Promise.all(timeline_promises).then(function (timelines) {
    let dataset_promises = timelines.map((t,i) => (
      {
        label: counties[i],
        borderColor: line_colors[i],
        data: t.deaths,
        fill: false
      }
    ));

    Promise.all(dataset_promises).then(function (datasets) {
      window._datasets = datasets;
      let ctx = document.getElementById('county').getContext('2d');
      let chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timelines[0].dates,
          datasets: datasets
        },
        options: {}
      });
    });
  });
});
