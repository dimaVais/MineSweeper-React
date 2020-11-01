import { Consts } from '../consts.js'
import { GameCell } from './GameCell.jsx'
import { utilService } from '../services/utils-service.js'
import 'assets/css/main.css'


export class GameBoard extends React.Component {

    state = {
        boardSize: this.props.size,
        board: [],
        firstClickedCell: null
    }

    componentDidMount() {
        const initBoard = [];
        for (let i = 0; i < this.state.boardSize; i++) {
            initBoard[i] = [];
            for (let j = 0; j < this.state.boardSize; j++) {
                initBoard[i][j] = { i: i, j: j };
            }
        }
        this.setState({ board: initBoard })
    }

    //Build final board after first click with mines and negs
    async buildBoard() {
        let minesLocations = this.getMinesLocations();
        await this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        const isMine = this.isMineLocation(minesLocations, cell.i, cell.j);
                        return { i: cell.i, j: cell.j, isMine: isMine };
                    })
                })
        });
        await this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        return {
                            ...cell,
                            minesAroundCount: this.countNeighbors(cell.i, cell.j)
                        };
                    })
                })
        });
    }

    //Count negs with mines for each cell.
    countNeighbors(cellI, cellJ) {
        var neighborsSum = 0;
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= this.state.boardSize) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= this.state.boardSize) continue;
                if (this.state.board[i][j].isMine) neighborsSum++;
            }
        }
        return neighborsSum;
    }


    //Get Random mines locations
    getMinesLocations = () => {
        const minesLocs = [];
        while (minesLocs.length < this.props.mineCount) {
            var loc = { i: 0, j: 0 };
            loc.i = utilService.getRandomInt(0, this.state.boardSize);
            loc.j = utilService.getRandomInt(0, this.state.boardSize);
            if (loc.i === this.state.firstClickedCell.i && loc.j === this.state.firstClickedCell.j) continue;
            var isInMines = false;
            for (var i = 0; i < minesLocs.length; i++) {
                if (loc.i === minesLocs[i].i && loc.j === minesLocs[i].j) {
                    isInMines = true;
                    break;
                }
            }
            if (isInMines) continue;
            minesLocs.push(loc);
        }
        return minesLocs;
    }

    //Check if a cell is in selected locations for mines.
    isMineLocation(minesLocations, i, j) {
        for (var idx = 0; idx < minesLocations.length; idx++) {
            if (minesLocations[idx].i === i && minesLocations[idx].j === j) return true;
        }
        return false;
    }

    onClickOnCell = (cellI, cellJ, isMarked) => {
        if (!this.props.isFirstClick) {
            this.handleFirstClick(cellI, cellJ);
            return
        }

        if (isMarked) return;

        if (this.state.board[cellI][cellJ].minesAroundCount === 0 && !this.state.board[cellI][cellJ].isMine) {
            this.expandShownRec(cellI, cellJ);
        } else if (!this.state.board[cellI][cellJ].isMine) this.openCell(cellI, cellJ);
        else this.handleLooseLife(cellI, cellJ);
    }

    handleFirstClick = async (cellI, cellJ) => {
        await this.setState({ firstClickedCell: { i: cellI, j: cellJ } })
        await this.buildBoard();
        this.props.onActionOnBoard("firstClick");
        this.onClickOnCell(cellI, cellJ);
    }

    handleLooseLife = async (cellI, cellJ) => {
        await this.props.onActionOnBoard("looseLife");
        const changedKey = (this.props.lifeAmount > 0) ? 'isWarning' : 'isBoom';
        await this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        if (cell.i === cellI && cell.j === cellJ) {
                            cell[changedKey] = true;
                        }
                        return cell;
                    })
                })
        });
    }

    //Mark cell with flag
    OnMarkCell = async (_cell) => {
        if (!this.props.isFirstClick) return;
        if (_cell.isShown && !_cell.isMarked) return;
        else {
            await this.setState({
                board:
                    this.state.board.map(line => {
                        return line.map(cell => {
                            if (cell.i === _cell.pos.i && cell.j === _cell.pos.j) {
                                cell.isMarked = !_cell.isMarked
                            }
                            return cell;
                        })
                    })
            });
            if (!_cell.isMarked) {
                this.props.onActionOnBoard("markCell");
            } else {
                this.props.onActionOnBoard("unMarkCell");
            }
        }
    }

    //Open cell with nheibors with mines
    openCell = async (cellI, cellJ) => {
        await this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        if (cell.i === cellI && cell.j === cellJ) {
                            cell.isShown = true
                        }
                        return cell;
                    })
                })
        });
        this.props.onActionOnBoard("openCell");
    }


    // Recurcive expand of neibors in all level
    expandShownRec = (cellI, cellJ) => {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= this.state.board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= this.state.board.length) continue;
                if (this.state.board[i][j].minesAroundCount > 0 && !this.state.board[i][j].isShown) this.openCell(i, j);
                else {
                    if (!this.state.board[i][j].isShown) {
                        this.openCell(i, j);
                        this.expandShownRec(i, j);
                    }
                }
            }
        }
    }

    // Hint mouse hover functionality
    hintMouse = (cellI, cellJ) => {
        const negs = this.getNegsLoop(cellI, cellJ)
        this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        if (negs.find(neg => { return cell.i === neg.i && neg.j === cell.j && !cell.isShown })) {
                            cell.isHintHoover = true;
                        } else {
                            cell.isHintHoover = false;
                        }
                        return cell;
                    });

                })
        })
    }

    // Click on hint to watch board
    hintClick = (cellI, cellJ) => {
        const negs = this.getNegsLoop(cellI, cellJ);
        this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        if (negs.find(neg => { return cell.i === neg.i && neg.j === cell.j && !cell.isShown })) {
                            cell.isOpneHint = true;
                        }
                        return cell;
                    });

                })
        })

        setTimeout(() => { this.clearHint(negs); }, 1000);
    }

    // Remove hint mode
    clearHint = (negs) => {
        this.setState({
            board:
                this.state.board.map(line => {
                    return line.map(cell => {
                        if (negs.find(neg => { return cell.i === neg.i && neg.j === cell.j && !cell.isShown })) {
                            cell.isOpneHint = false;
                            cell.isHintMode = false;
                        }
                        return cell;
                    });
                })
        })
        this.props.onFinishHint();
    }

    getNegsLoop = (cellI, cellJ) => {
        const negs = []
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= this.state.boardSize) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= this.state.boardSize) continue;
                negs.push(this.state.board[i][j])
            }
        }
        return negs;
    }

    render() {
        const isBoard = this.state.board.length > 0;
        return (
            isBoard && <table>
                <tbody>
                    {this.state.board.map((line, idx) => {
                        return <tr key={idx}>
                            {line.map((cell, idx2) => {
                                const minesAroundCount = (cell.minesAroundCount) ? cell.minesAroundCount : null
                                const isShown = (cell.isShown) ? cell.isShown : null
                                const isWarning = (cell.isWarning) ? cell.isWarning : null
                                const isBoom = (cell.isBoom) ? cell.isBoom : null
                                const isHintHoover = (cell.isHintHoover) ? cell.isHintHoover : null
                                const isOpneHint = (cell.isOpneHint) ? cell.isOpneHint : null
                                const isCloseHint = (cell.isCloseHint) ? cell.isCloseHint : null
                                return <GameCell key={`${idx}_${idx2}`}
                                    onClickOnCell={this.onClickOnCell} OnMarkCell={this.OnMarkCell}
                                    i={cell.i} j={cell.j} isMine={cell.isMine}
                                    isShown={isShown} isMarked={cell.isMarked} minesAroundCount={minesAroundCount}
                                    isWarning={isWarning} isBoom={isBoom} isGameOver={this.props.isGameOver}
                                    isHintMode={this.props.gIsHint} hintMouse={this.hintMouse} hintClick={this.hintClick}
                                    isHintHoover={isHintHoover} isOpneHint={isOpneHint} isCloseHint={isCloseHint}
                                    isOn={this.props.isOn} />
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        )
    }
}