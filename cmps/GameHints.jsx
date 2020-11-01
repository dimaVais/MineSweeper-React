import {utilService} from '../services/utils-service.js'

export class GameHints extends React.Component {

    state = {
        hints: []
    }

    componentDidMount() {
        const currHints = []
        for (let i = 0; i < this.props.hintCount; i++) {
            currHints[i] = { 
                id: utilService.makeId(), 
                isOn: false };
        }
        this.setState({ hints: [...currHints] });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hintCount !== this.props.hintCount) {
            this.removeHint();
        }
    }

    giveHint = async (ev) => {
        if (this.state.hints.find(hint => { return hint.isOn }) || !this.props.isFirstClick) {
            return;
        }
        const hintOn = ev.target.name;
        await this.setState({
            hints: this.state.hints.map(hint => {
                if (hintOn === hint.id){
                    hint.isOn = true;
                } 
                return hint;
            })
        });
        this.props.onSetHintMode();
    }

    removeHint = async () => {
        await  this.setState({
            hints: this.state.hints.filter(hint => { return !hint.isOn })
        })
    }

    render() {
        return (
            <div className="hintsBox ">
                <h1>HINTS:</h1>
                <div className="flex-row justify-center align-center">
                    {this.state.hints.map(hint => {
                        const hintImg = (hint.isOn) ? "hintOn.jpg" : "hintOff.png";
                        return <img className="hintImg" src={`assets/img/${hintImg}`}
                            onClick={this.giveHint} name={hint.id} key={hint.id} />
                    })}
                </div>
            </div>

        )
    }

}