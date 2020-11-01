import { GameHints } from './cmps/GameHints.jsx'
import { Game } from './pages/Game.jsx'
// import { NavBar } from 'cmps/NavBar.jsx'

const Router = ReactRouterDOM.HashRouter
const { Route, Switch } = ReactRouterDOM

export class App extends React.Component {

    state = {
        size: 4,
        boardId: Math.random(),
        time: '',
        iconImg: 'normal.png',
        isHintMode: false,
        hintCount: 3,
        isFirstClick: false
    }

    setLevel = (levelSize) => {
        this.setState({
            size: levelSize,
            boardId: Math.random(),
            time: '',
            iconImg: 'normal.png',
        })
    }

    onFinishLevel = (status) => {
        let icon = '';
        if (status === 'win') icon = 'win.png'
        else if (status === 'loose') icon = 'sad.png'
        else icon = 'normal.png'
        this.setState({ iconImg: icon });
    }

    render() {
        return (
            <Router>
                <div>
                    <header className={"flex-col  align-center"}>
                        <h1>WELCOME TO Minesweeper <br /> <span className="best"> </span></h1>
                        <div className={"flex-row  space-around"}>
                            <div className="btnBox flex-col space-around align-center">
                                <div >
                                    <img key={this.state.iconImg} onClick={() => { this.setLevel(this.state.size) }}
                                        className="smile" src={`assets/img/${this.state.iconImg}`} />
                                </div>
                                <div>
                                    <button className="butt1" onClick={() => { this.setLevel(4) }}>Beginner</button>
                                    <button className="butt1" onClick={() => { this.setLevel(8) }}>Medium</button>
                                    <button className="butt1" onClick={() => { this.setLevel(12) }}>Expert</button>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main>
                        <Game key={this.state.boardId} sizeFromUser={this.state.size} boardId={this.state.boardId}
                            isHintMode={this.state.isHintMode} showTime={this.showTime} onFinishLevel={this.onFinishLevel}
                            onSetFirstClick={this.onSetFirstClick} onFinishHint={this.onFinishHint} />
                    </main>
                    <footer> </footer>
                </div>
            </Router>
        )
    }
}

