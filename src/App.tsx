import React from 'react';
import Select, { ValueType, OptionTypeBase } from 'react-select';
import './App.css';
import { Session, Plan } from './Figure';

const simplePlan: Plan = [
  { name: 'Warm-up I', duration: 30, times: 10 },
  { name: 'Warm-up II', duration: 60, times: 5 },
  { name: 'Study I', duration: 60 * 5, times: 2 },
  // { name: 'Study II', duration: 60 * 5, times: 2 },
  { name: 'Long Study I', duration: 60 * 10, times: 1 },
];


const unsplashUrl = (path: string) => `https://source.unsplash.com/${path}`

const dims = '1920x1080'
const Collections: { [key: string]: number } = { 
  mine: 265330,
  tia: 155450,
  moi: 2349880,
}

const Sources = {
  random: unsplashUrl(`random/${dims}?person`),
  search: (term: string) => unsplashUrl(`${dims}/?${term}`),
  collection: (id: number) => unsplashUrl(`collection/${id}/${dims}`),
}

type SourceKind = 'mine' | 'tia' | 'model' | 'random' | 'men' | 'women' | 'moi' | 'nude'
let options = [
  { value: 'mine', label: 'My Favorite Figures' },
  { value: 'tia', label: "Tia's Collection" },
  { value: 'moi', label: "'Humans' Collection" },
  { value: 'men', label: "Men" },
  { value: 'women', label: "Women" },
  { value: 'model', label: "Models" },
  { value: 'random', label: "People (Random)" },
  { value: 'nude', label: "Pose" },
]

type ManagerState = {
  started: boolean
  source: SourceKind
  plan: Plan
  sourceOption: ValueType<OptionTypeBase> | null
}

class SessionManager extends React.Component<{}, ManagerState> {
  state: ManagerState = { source: 'mine', started: false, sourceOption: options[0], plan: simplePlan }
  onSourceChange = (selectedSourceOption: ValueType<OptionTypeBase>) => {
    if (selectedSourceOption) {
      this.setState({
        // @ts-ignore
        source: selectedSourceOption.value,
        sourceOption: selectedSourceOption
      })
    }
  }

  get sourceUri(): string {
    let { source } = this.state;
    if (source === 'random') {
      return Sources.search('human');
    } else if (source === 'mine' || source === 'tia' || source === 'moi') {
      let src = Sources.collection(Collections[source])
      return src;
    } else {
      return Sources.search(source);
    }
  }

  get classDuration(): number {
    return this.state.plan.map(plan => plan.duration * plan.times).reduce((d, d2) => d + d2) / 60
  }

  render() {
    if (!this.state.started) {
      
      return <div className="Manager">
        <h1>FIGURE</h1>
        <p>Let's find a source of inspiration for you today!</p>
        <Select 
          value={this.state.sourceOption}
          onChange={this.onSourceChange}
          options={options}
          theme={theme => ({ 
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              neutral0: 'black',
              neutral50: 'white',
              neutral60: 'white',
              neutral70: 'white',
              neutral80: 'white',
              neutral90: 'white',
              primary: 'white',
              primary25: '#3a3a3a',
            }
          })}
        />
        <br/> <br/>
        <hr style={{width:'68%'}}/>
        <br/>
        <p>
          We will prepare a {this.classDuration}-minute class with the collection <b>"{this.state.source}"</b>.
        </p>
        <p>
          <b>Remember to have fun.</b>
        </p>
        <br/>
        <button 
          onClick={() => this.setState({ started: true })}
          >
          Let's go!
          </button>
      </div>
    } else {
      return <Session
          source={this.sourceUri}
          plan={simplePlan}
        />
      }
  }
}

const App: React.FC = () => {
  return (
    <div className="App">
      <main className="App-content">
        <SessionManager />
      </main>
    </div>
  );
}

export default App;
