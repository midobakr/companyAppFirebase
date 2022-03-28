import classes from "./button.module.css";
import Spinner from '../spinner/spinner'


function Button({name , onSubmit , loading ,color}) {

    return(
        <button style={{backgroundColor:color}} className={classes.button} onClick={onSubmit}>{name}
           {
      
        <div style={{position:'absolute' , right:'10px' ,top:'10px' }}>
          <Spinner show={loading} margin='0px' size='5px'/>
        </div>
        
        }
        </button>   
    )
}
 
export default Button