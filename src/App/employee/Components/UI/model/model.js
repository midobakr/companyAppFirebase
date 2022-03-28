import {memo} from "react";
import classes from "./model.module.css";

import Spinner from "../spinner/spinner";
 function Model(props) {
    return(
        <div
        style={{top:props.show? '40%':'-100%'}} 
        className={classes.container}>
            {props.loading ?<Spinner/>:''}  
            {props.errors ?
            <div>
            <p style={{margin:0, paddingLeft:'5px'}}> {props.errors.msg}</p>
            <button style={{padding:'5px'}}  onClick={props.hide} >
                Cancel
            </button>

            </div>
            :''}
        
        </div>
    )
    
}
export default memo(Model)
//&#10006;