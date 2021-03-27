class CovidCounty {
  constructor(timeline) {
    this.timeline = timeline // array of { date: String, cases: Int, deaths: Int }
  }

  get dates() { return this.timeline.map(d => d.date) }
  get cumulativeCases() { return this.timeline.map(d => d.cases) }
  get cumulativeDeaths() { return this.timeline.map(d => d.deaths) }

  get cases() {
    return this.timeline.map((d,i,a) => i < 1 ? d.cases : d.cases - a[i-1].cases)
  }

  get deaths() {
    return this.timeline.map((d,i,a) => i < 1 ? d.deaths : d.deaths - a[i-1].deaths)
  }
}
