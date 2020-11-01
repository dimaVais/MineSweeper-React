
import { utilService } from '../services/utils-service.js';

export class GameTime extends React.Component {
    state = {
        timeFormat: ''
    }

    componentDidUpdate(prevProps) {
        if(prevProps.timeDiff !== this.props.timeDiff){
            this.formatTime();
        }
    }

    formatTime=()=>{
        const timeDiff = this.props.timeDiff;
        const secsPrint = utilService.printTime(timeDiff);
        this.setState({timeFormat:secsPrint})
    }

    render() {
        return (
            <div className="timer">
                TIME: <span>{this.state.timeFormat}</span>
            </div>

        )
    }
}