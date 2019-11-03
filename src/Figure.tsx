import React from "react"

type FigureProps = { source: string, hash: string }
const Figure: React.FC<FigureProps> = (props: FigureProps) => {
  return (
    <div className="Figure">
      <img
        style={{width: '100vw'}}
        src={`${props.source}?${props.hash}`}
        />
    </div>
  )
}

type Phase = { name: string, duration: number, times: number }
export type Plan = Phase[]

type SessionProps = {
  plan: Plan,
  source: string
}

type SessionState = {
  phaseIndex: number,
  stepIndex: number,
  lastAdvancedAt: number,
  secondsElapsed: number,
  secondsRemaining: number,
}

export class Session extends React.Component<SessionProps, SessionState> {
  state: SessionState = {
    phaseIndex: 0,
    stepIndex: 0,
    lastAdvancedAt: -1,
    secondsElapsed: -1,
    secondsRemaining: -1,
  }

  tick = () => {
    if (this.phase) {
      let now = new Date().getTime();
      let secondsElapsed = (now - this.state.lastAdvancedAt) / 1000;
      let secondsRemaining = this.phase.duration - secondsElapsed
      this.setState({ secondsRemaining, secondsElapsed }, () => {
        setTimeout(this.tick, 200)
      })
    }
  }

  advanceTimerId: any = null
  advance = () => {
    let lastAdvancedAt = new Date().getTime();
    let { times } = this.phase
    let { stepIndex, phaseIndex } = this.state
    stepIndex = stepIndex + 1
    if (stepIndex >= times) {
      phaseIndex = phaseIndex + 1
      stepIndex = 1
    }
    this.setState({
      stepIndex,
      phaseIndex,
      lastAdvancedAt,
    }, () => {
      if (this.phase) {
        let { duration } = this.phase;
        clearInterval(this.advanceTimerId)
        this.advanceTimerId = setTimeout(this.advance, duration * 1000)
      }
    })
  }

  kickstart = () => {
    this.setState({ stepIndex: 0, phaseIndex: 0 }, this.advance)
  }

  componentDidMount() {
    this.advance();
    this.tick();
  }

  get phase(): Phase { return this.props.plan[this.state.phaseIndex] }

  get message(): string {
    return this.phase ? this.phase.name : "Congrats, you've completed the class!"
  }

  get stepIndicator(): string {
    return `(${this.state.stepIndex} / ${this.phase ? this.phase.times : '?'})`;
  }

  get timeLeft(): string {
    let { secondsRemaining } = this.state; 
    if (secondsRemaining > 0) {
      const lp = (n: any) => ("00" + String(n)).slice(-2)
      let { floor } = Math;
      return `${lp(floor(secondsRemaining / 60))}:${lp(floor(secondsRemaining % 60))}`
    } else { return '--'}
  }

  render() {
    if (this.phase) {
    return <div className="Session">
      <p>
        <b>{this.message}</b>
        <br/>
        <small>{this.stepIndicator}</small>
      </p>
      <Figure
        source={this.props.source}
        hash={String(this.state.lastAdvancedAt)}
      />
      <small>{this.timeLeft}</small>
      <p>
        {this.state.secondsElapsed > 3 ? <button onClick={this.advance}>skip</button> : ''}
      </p>
    </div>
    } else {
      return <><p>{this.message}</p>
        <button onClick={this.kickstart}>again!</button>
        </>
    }
  }
}