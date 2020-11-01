import { Consts } from '../consts.js'

export class GameCell extends React.Component {

    state = {
        pos: {},
        minesAroundCount: null,
        isShown: null,
        isMine: null,
        isMarked: null,
        isBoom: null,
        isWarning: null,
        isHintMode: false,
        isHintHoover: false,
        isOpneHint: false,
        isCloseHint: false
    }

    async componentDidMount() {
        await this.setState({
            pos: { i: this.props.i, j: this.props.j },
            minesAroundCount: (this.props.minesAroundCount) ? this.props.minesAroundCount : 0,
            isShown: (this.props.isShown && !this.state.isShown) ? this.props.isShown : this.state.isShown,
            isMine: (this.props.isMine) ? this.props.isMine : false,
            isMarked: (this.props.isMarked) ? this.props.isMarked : false,
        })
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.minesAroundCount !== this.props.minesAroundCount ||
            prevProps.isMine !== this.props.isMine ||
            prevProps.isShown !== this.props.isShown ||
            prevProps.isMarked !== this.props.isMarked ||
            prevProps.isBoom !== this.props.isBoom ||
            prevProps.isWarning !== this.props.isWarning ||
            prevProps.isHintMode !== this.props.isHintMode ||
            prevProps.isHintHoover !== this.props.isHintHoover ||
            prevProps.isOpneHint !== this.props.isOpneHint) {

            await this.setState({
                pos: { i: this.props.i, j: this.props.j },
                minesAroundCount: (this.props.minesAroundCount) ? this.props.minesAroundCount : 0,
                isShown: (this.props.isShown && !this.state.isShown) ? this.props.isShown : this.state.isShown,
                isMine: (this.props.isMine) ? this.props.isMine : false,
                isMarked: (this.props.isMarked) ? this.props.isMarked : false,
                isBoom: (this.props.isBoom && !this.state.isBoom) ? this.props.isBoom : this.state.isBoom,
                isWarning: (this.props.isWarning && !this.state.isWarning) ? this.props.isWarning : this.state.isWarning,
                isHintMode: (this.props.isHintMode) ? true : false,
                isHintHoover: (this.props.isHintHoover) ? true : false,
                isOpneHint: (this.props.isOpneHint) ? true : false
            })
        }
    }

    getCellClassName = () => {
        if (this.state.isHintMode && this.state.isHintHoover) {
            return 'cellHint';
        }
        else if (this.state.isHintMode && this.state.isOpneHint) {
            return 'cellHint cellOpen';
        } else {
            return (this.state.isShown || this.props.isGameOver) ? 'cellOpen' : 'cellClose';
        }
    }

    getSpanClassName = () => {
        if (this.state.isHintMode && this.state.isOpneHint) {
            return 'spanOpen';
        } else {
            let className = '';
            if (!this.state.isMarked && (this.state.isShown || this.props.isGameOver)) className = 'spanOpen';
            if (this.state.isMarked) className = 'spanOpen spanMarked';
            if (this.state.isWarning) className = 'spanWarning';
            if (this.state.isBoom) className = 'spanBoom';
            if (!className) className = 'spanClose';
            return className;
        }

    }

    getSpanContent = () => {
        let content = '';
        if (this.state.isMarked) content = Consts.FLAG;
        else if (this.state.isMine) content = Consts.MINE;
        else if (this.state.minesAroundCount === 0) content = '';
        else content = this.state.minesAroundCount;
        return content;
    }

    onCellClick = () => {
        if (!this.state.isMarked && !this.state.isHintMode) {
            this.setState({ isShown: true })
            this.props.onClickOnCell(this.state.pos.i, this.state.pos.j, this.state.isMarked)
        } else if (this.state.isHintMode) {
            this.props.hintClick(this.state.pos.i, this.state.pos.j);
        }
    }

    onCellMark = async (ev) => {
        ev.preventDefault();
        this.props.OnMarkCell(this.state)
    }

    onMouseOver = () => {
        if (this.state.isHintMode) {
            this.props.hintMouse(this.state.pos.i, this.state.pos.j);
        }
    }

    render() {
        const cellOpenClass = this.getCellClassName();
        const spanContent = this.getSpanContent();
        const spanClassName = this.getSpanClassName();
        return (
            <td className={`cell ${cellOpenClass}`} onClick={this.onCellClick} onContextMenu={this.onCellMark} onMouseEnter={() => { this.onMouseOver() }} >
                <span className={spanClassName}>
                    {(this.state.isMine && !this.state.isMarked) ?
                        <img className="mine-icon" src={spanContent} /> : spanContent} </span>
            </td>
        )
    }

}