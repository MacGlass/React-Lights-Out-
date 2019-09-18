import React, { Component } from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.50
  }

  constructor(props) {
    super(props);
    this.state = { numCellsOn: 0, numGuesses: 0, hasWon: false, board: this.createBoard() }
    this.flipCellsAround = this.flipCellsAround.bind(this);
    // TODO: set initial state
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let rows = []
      for (let j = 0; j < this.props.ncols; j++) {
        let randomNum = Math.random()
        if (randomNum > this.props.chanceLightStartsOn) {
          rows.push(true);
        }
        else {
          rows.push(false);
        }
      }
      board.push(rows)
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y, x)
    flipCell(y + 1, x)
    flipCell(y - 1, x)
    flipCell(y, x + 1)
    flipCell(y, x - 1)

    let hasWon = true
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (board[i][j] === true) {
          hasWon = false

        }
      }
    }
    // TODO: flip this cell and the cells around it

    // win when every cell is turned off
    // TODO: determine is the game has been won

    this.setState(st => ({
      board,
      hasWon,
      numGuesses: st.numGuesses + 1
    }));
  }

  howManyOn(board) {
    let numOn = 0
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === true) {
          numOn++
        }
      }
    }
    return numOn
  }

  /** Render game board or winning message. */

  render() {

    let numOn = this.howManyOn(this.state.board)
    if (this.state.hasWon) {
      return (
        <p>Congrats! You've Won!</p>
      )
    } else {

      return (
        <div className='game'>

          {this.state.board.map((row, y) => (
            <tr key={y}>
              {this.state.board[y].map((col, x) => (
                <Cell isLit={this.state.board[y][x]} flipCellsAroundMe={this.flipCellsAround} key={`${y}-${x}`} id={`${y}-${x}`} />
              ))}
            </tr>
          ))}

          <p>Number of clicks: {this.state.numGuesses}</p>
          <p>Board Size: {this.props.nrows} x {this.props.ncols} </p>
          <p>Number of Cells Turned On: {numOn}</p>
        </div>

      )
    }
  }
}


export default Board;
