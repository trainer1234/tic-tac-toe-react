import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className='square'
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, j) {
        return (
            <Square key={j}
              value={this.props.squares[i][j]}
              onClick={() => this.props.onClick(i, j)}
            />
        );       
    }

    render() {
        return (
            <div>
                {this.props.squares.map((row, i) => 
                    <div key={i} className="board-row">
                        {this.props.squares[i].map((col, j) => this.renderSquare(i, j))}
                    </div>
                )}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            row: 3,
            col: 3,
            history: [{
                // stepRow: -1,
                // stepCol: -1,
                squares: Array(3).fill().map(_ => Array(3).fill().map(_ => null)),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.map(inner => inner.slice());
        
        if (squares[i][j]) {
            return;
        }

        squares[i][j] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares: squares,
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        // const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // console.log("Step ", step);
            // console.log("Move ", move);
            const desc = move ? `Go to move #${move}` : `Go to game start`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
        let status;
        // if (winner) {
        //     status = `Winner ${winner}`;
        // }
        // else {
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        // }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i, j) => this.handleClick(i, j)} 
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// TODO tic-tac-toe winner algorithm
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

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);