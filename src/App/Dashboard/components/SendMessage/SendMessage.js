import {useEffect , useState} from 'react'
import {Link,Route} from "react-router-dom";
import {useSelector} from 'react-redux'

import TextUser from "../textUser/textUser";
import Search from "../../../employee/Components/UI/search/Search";

import classes from './SendMessage.module.css';
 
function SendMessage() {
    let [usersArray , setUsersArray] = useState([])
    let [allUsers , setAllUsers] = useState([])
    let [pathID , setpathID] = useState(window.location.pathname.split('/')[3])
    let Firebase = useSelector(state => state.firebase)

    function search(arr){
        setUsersArray(arr)
    }
    useEffect(()=>{
        Firebase.getUsers().then((users) => {
            setAllUsers(Object.values(users.val()))
            setUsersArray(Object.values(users.val()))
        })
    },[Firebase])

    let theAction =(id)=>{
        setpathID(id);
    }
  
    return(
        <div  className={classes.container} >      
            
            <div  className={classes.container2} >
                <div className={classes.searchContainer}>
                    <Search action={search} fullArray={allUsers}/>
                </div>

                <div className={classes.boxContainer}>
                    {!usersArray[0]?'':
                            usersArray.map(user=>        
                            <Link to={`/admin/sendMessage/${user.id}/00`} className={classes.box}
                            style={pathID===user.id?
                            {background:'#1A92DC'}
                            :
                            {}
                           }>
                            <div className={classes.info} >
                                <span className={classes.name}>
                                 {user.username}
                                </span>
                                </div>
                                <img  className={classes.icon} style={{borderRadius:'50%'}} src={user.avatar} alt=''/>
                            </Link> 
                    )}
                </div>
            </div>
            <div className={classes.container3} >
                        <Route  path='/admin/sendMessage/:id/:unSeenMSGS'>
                            <TextUser action={theAction}/>
                        </Route>
            </div>
        </div>
    ) 
}

export default SendMessage 