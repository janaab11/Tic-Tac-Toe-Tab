/* global chrome */

import React from 'react';
import './Game.css';
import Board from '/Users/knethil/projects/my-first-extension/src/Components/Board/Board';
import {calculateWinner,getWinningSquares} from '/Users/knethil/projects/my-first-extension/src/Utils/helper';

let port=chrome.runtime.connect({name:'game-state'});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      descending: false,
      stepClicked: null
    };
  }

  componentDidMount(){
    // alert('sending handshake');
    port.postMessage({caller:'did-mount'});
    port.onMessage.addListener((msg)=>{
      this.setState(msg.state);
    });
  }

  componentDidUpdate(){
    port.postMessage({caller:'did-update',state:this.state});
    // alert('sent state to save')
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    history.push({ squares });
    this.setState({
      history: history,
      stepNumber: history.length - 1,
      xIsNext: !this.state.xIsNext,
      stepClicked: null
    });
  }

  goTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      stepClicked: step
    });
  }
  
  handleToggle(){
    this.setState({
      descending:!this.state.descending
    });
  }
  
  handleReset(){
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      descending: false,
      stepClicked: null
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const movesList = history.map((board, step) => {
      const display = step ? "Go to step " + step : "Go to game start";
      const movesListStyle=(step===this.state.stepClicked)?{'font-weight':'bold'}:{};
      return (
        <li key={step}>
          <div>
            <button style={movesListStyle}
                    className='moves-list-button' 
                    onClick={() => this.goTo(step)}> {display} </button>
          </div>
        </li>
      );
    });
    
    let list=<ol>{movesList}</ol>;
    if(this.state.descending){
      const reverseList=movesList.reverse();
      list=<ol reversed>{reverseList}</ol>;
    }

    let status;
    let winningSquares=Array(9).fill(0).map(()=>false)
    if (winner) {
      status = "Winner: " + winner;
      const wins=getWinningSquares(current.squares);
      for(let i=0;i<wins.length;i++){
        winningSquares[wins[i]]=true;
      }
    } else if (this.state.stepNumber < 9) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Draw";
    }

    const descButtonStyle=(movesList.length<=1)?{display:'none'}:{};

    return (
      <div className="game">
        <div className='game-extended'>
          <div className='game-info-board'>
            <div className="game-info">
              {status}
            </div>
            <div className="game-board">
              <Board squares={current.squares}
                     onClick={i => this.handleClick(i)}
                     winningSquares={winningSquares} />
            </div>
          </div>
          <div>
            <button className='reset-button' onClick={()=>this.handleReset()} >Reset Game</button>
          </div>
        </div>
        <div className='moves-list-extended'>
          <div className='desc-button' style={descButtonStyle}>
            <label>
              <input className='check-box' 
                     type="checkbox" 
                     checked={this.state.descending} 
                     onChange={()=>this.handleToggle()} />
              Make list descending!
            </label>
          </div>
          <div className='moves-list'>
            {list}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
