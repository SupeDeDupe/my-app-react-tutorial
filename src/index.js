import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {useSpring, animated} from 'react-spring'

function Square(props) {
      return (
        <button 
            className="square" 
            style={ props.value !== null ? { background: 'white' } : null}
            onClick={() => { props.onClick() }}
        >
          {props.value}
        </button>
      );
  }

function Animate(props) {
  const animatedProps = useSpring({opacity: 1, from: {opacity: 0}})
  return <animated.div style={animatedProps}>{props.moves}</animated.div>
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history:  [{
          squares:  Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i])
          return;
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
            squares: squares
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <div>
            <Button variant="primary" onClick={() => this.jumpTo(move)}>{desc}</Button>
          </div>
        );
      });

      let status;
      if (winner)
        status = 'Winner: ' + winner;
      else
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');


      return (
        <Container>
        <h1>Sarah's Tic Tac Toe</h1>
        <div className="game">
          <Row className="justify-content-md-center">
            <Col md="auto" className="game-board">
              <Board 
                squares={current.squares}
                onClick={(i)=> this.handleClick(i)}
              />
            </Col>
            <Col md="auto" className="game-info">
              <div className='status'>{status}</div>
              <ol>
                <Animate moves={moves}></Animate>
              </ol>
            </Col>
          </Row>
          </div>
        </Container>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  