import {Link} from "react-router-dom";
import classes from "./nav.module.css"
import {useDispatch} from 'react-redux'
import {REMOVE_TOKEN} from '../../store/actions/actions' 
import {deleteSubscription} from '../../subscription' 
function Nav(props) {
    const dispatch = useDispatch()

    const logOut =async()=>{
        await deleteSubscription()
        dispatch({type:REMOVE_TOKEN})
        // localStorage.removeItem('token')

    }
    return(
        <nav className={classes.nav}>
            <ul className={classes.nav_list}>
                <li>profile</li>
                <li onClick={logOut}>
                    <Link to='/'> log out</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Nav
