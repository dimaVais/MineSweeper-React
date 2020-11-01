export class GameLife extends React.Component {
    state = {
        lifes: [],
    }

    componentDidMount() {
        const currLifes = []
        for (let i = 0; i < this.props.lifeAmount; i++) {
            currLifes[i] = i;
        }
        this.setState({ lifes: [...currLifes] });
    }

    render() {
        return (
            <div className="lifeBox">
                {this.state.lifes.map(idx => {
                    return <img className="lifeImg" src='assets/img/life.jpg' key={idx} />
                })}
            </div>
        )
    }
}