import { memo} from "react";

import classes from "./backdrop.module.css";

 function Backdrop(props) {

    return(
        <div className={classes.container} style={props.show ?{display:'flex'}:{display:'none'}} ></div>
    )
}
export default memo(Backdrop)