import { Consts } from '../consts.js'
import { GameBoard } from '../cmps/GameBoard.jsx'
import { GameLife } from '../cmps/GameLife.jsx'
import { GameHints } from '../cmps/GameHints.jsx'
import { utilService } from '../services/utils-service.js';
import { GameTime } from '../cmps/GameTime.jsx';

export class Game extends React.Component {

    state = {
        sizeFromUser: null,
        gLevel: null,
        gGame: null,
        gTimeInterval: null,
        gBestScore: null,
        gIsHint: null,
        gHintsCount: null
    }

    componentDidMount() {
        this.resetTheGame();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.sizeFromUser !== this.props.sizeFromUser) {
            this.resetTheGame();
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.gTimeInterval);
    }

    resetTheGame() {
        this.setState({
            gGame: this.createGame(),
            gLevel: this.setLevel(this.props.sizeFromUser),
            gIsHint: false,
            gHintsCount: 3
        })
        if (this.state.gTimeInterval) clearInterval(this.state.gTimeInterval);
    }

    createGame = () => {
        return {
            isOn: false,
            isGameOver: false,
            shownCount: 0,
            markedCount: 0,
            yellowMinesCount: 0,
            startTime: 0,
            secsPassed: 0,
            isFirstClick: false,
            firstClickedCell: null,
            lifeAmount: 3
        };
    }

    setLevel = (sizeFromUser) => {
        let mines = 0
        if (sizeFromUser === 4) mines = 2;
        else if (sizeFromUser === 8) mines = 12;
        else if (sizeFromUser === 12) mines = 30;
        else mines = 5;

        return { SIZE: sizeFromUser, MINES: mines };
    }

    OnfirstClick = (cellI, cellJ) => {
        if (this.state.gTimeInterval) clearInterval(this.state.gTimeInterval);
        this.setState({
            gGame: {
                ...this.state.gGame,
                isFirstClick: true,
                firstClickedCell: { i: cellI, j: cellJ },
                startTime: Date.now(),
            },
            gTimeInterval: setInterval(() => { this.setGameTime() }, 500)
        })
        this.setState({
            gGame: {
                ...this.state.gGame,
                isOn: true
            }
        });
    }

    setGameTime = async () => {
        const newTime = Date.now();
        await this.setState({
            gGame: {
                ...this.state.gGame,
                secsPassed: newTime - this.state.gGame.startTime
            }
        })
    }

    onSetHintMode = async () => {
        await this.setState({ gIsHint: true })
    }

    onFinishHint = async () => {
        this.setState({ gIsHint: false });
        this.setState({ gHintsCount: this.state.gHintsCount - 1 });
    }

    onActionOnBoard = async (action) => {
        switch (action) {
            case "firstClick":
                this.OnfirstClick()
                break
            case "looseLife":
                await this.setState({
                    gGame: {
                        ...this.state.gGame,
                        lifeAmount: this.state.gGame.lifeAmount - 1
                    }
                })
                if (this.state.gGame.lifeAmount > 0) {
                    await this.setState({
                        gGame: {
                            ...this.state.gGame,
                            yellowMinesCount: this.state.gGame.yellowMinesCount + 1,
                            markedCount: (this.state.gGame.markedCount > 0) ? this.state.gGame.markedCount - 1 : this.state.gGame.markedCount
                        }
                    })
                    this.checkIfWin();
                } else {
                    this.gameOverLoose();
                }
                break;
            case "openCell":
                await this.setState({
                    gGame: {
                        ...this.state.gGame,
                        shownCount: this.state.gGame.shownCount + 1
                    }
                });
                this.checkIfWin();
                break
            case "markCell":
                await this.setState({
                    gGame: {
                        ...this.state.gGame,
                        markedCount: this.state.gGame.markedCount + 1
                    }
                })
                this.checkIfWin();
                break
            case "unMarkCell":
                await this.setState({
                    gGame: {
                        ...this.state.gGame,
                        markedCount: this.state.gGame.markedCount - 1
                    }
                })
                this.checkIfWin();
                break
        }
    }

    // Check for victory in game
    checkIfWin = () => {
        if (this.state.gGame.markedCount === this.state.gLevel.MINES - this.state.gGame.yellowMinesCount &&
            this.state.gGame.shownCount === (this.state.gLevel.SIZE) ** 2 - (this.state.gGame.markedCount + this.state.gGame.yellowMinesCount)) {
            setTimeout(() => { this.gameOverWin() }, 400);
        }
    }

    //Game is finished with victory
    gameOverWin() {
        this.setState({
            gGame: {
                ...this.state.gGame,
                isOn: false,
                isGameOver: true
            }
        })
        clearInterval(this.state.gTimeInterval);
        this.props.onFinishLevel('win')
        // setBestScore();
    }

    //Game is finished with lose
    gameOverLoose() {
        this.setState({
            gGame: {
                ...this.state.gGame,
                isOn: false,
                isGameOver: true
            }
        })
        clearInterval(this.state.gTimeInterval);
        this.props.onFinishLevel('loose')
    }

    render() {
        const isLevel = this.state.gLevel;
        const isGame = this.state.gGame;
        return (
            <section className="flex-col justify-center">
                <div className="flex-row justify-center">
                    {isGame && <GameHints key={this.props.boardId} hintCount={this.state.gHintsCount}
                        onSetHintMode={this.onSetHintMode} isFirstClick={this.state.gGame.isFirstClick} />}
                    {isGame && <GameLife key={this.state.gGame.lifeAmount} lifeAmount={this.state.gGame.lifeAmount} />}
                    {this.state.gGame && <GameTime timeDiff={this.state.gGame.secsPassed} />}
                </div>
                {isLevel && <GameBoard key={this.state.gLevel.SIZE + '_' + this.props.boardId} size={this.state.gLevel.SIZE}
                    mineCount={this.state.gLevel.MINES}
                    lifeAmount={this.state.gGame.lifeAmount}
                    gIsHint={this.state.gGame.gIsHint}
                    isFirstClick={this.state.gGame.isFirstClick}
                    isGameOver={this.state.gGame.isGameOver}
                    isOn={this.state.gGame.isOn} gIsHint={this.state.gIsHint}
                    onActionOnBoard={this.onActionOnBoard} onFinishHint={this.onFinishHint} />}
            </section>
        )
    }

}
