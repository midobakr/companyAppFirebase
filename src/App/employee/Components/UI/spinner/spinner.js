import classes from './spinner.module.css'

export default function Spinner({show,margin , size}) {
    return <div className={classes.loader} style={{visibility:show?'visible':'hidden',fontSize:size, margin}}></div>
} 