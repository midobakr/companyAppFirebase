import {useState} from "react";
import {useDispatch , useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

import classes from "./sidebar.module.css";
import {REMOVE_TOKEN }  from '../../../store/actions/actions'

import SidebarItem from "./sidebar_item/sidebarItem"; 
import exitIcon from "./icons/exit.png";
import peopleIcon from "./icons/people.svg";
import inboxICON from "./icons/inbox.svg";
import messageICON from "../../../employee/Components/SideSar/icons/message.png";
import Spinner from "../../../employee/Components/UI/spinner/spinner";
import profileIcon from "../../../employee/Components/SideSar/icons/profile.png";

function Sidebar({username , avatar}) {
    let unSeenMSGs = useSelector(state=>state.unseenMSGS)
    let Firebase = useSelector(state=>state.firebase)
    let dispatch = useDispatch()

    let pathName = window.location.pathname
    let pathNameArray = pathName.split('/')

    if(pathNameArray.length>3){
        pathNameArray.splice(-1)
        pathName= pathNameArray.join('/')
    }
    let [activeItem ,set_activeItem] = useState(pathName) 
   
    const logOut =async()=>{
        Firebase.doSignOut()
        dispatch({type:REMOVE_TOKEN})
       
    }
    return (
        <div className={classes.container}>
            <div className={classes.info}>
                <img className={classes.image}  
                src={avatar} 
                alt='' 
                />
                <span  className={classes.name} style={{verticalAlign:'middle',textAlign:'center' , color:'white',marginLeft:'10px'}}>{username}</span>
            </div>
            <ul className={classes.sidebar_list}>
        
                <SidebarItem name='Home' path='/' 
                setActive ={set_activeItem}
                theActiveItem={activeItem}
                icon={profileIcon}
                color='white'
                />
            
                <SidebarItem name='My Employees' path='/admin/allEmployees' 
                setActive ={set_activeItem} theActiveItem={activeItem}
                color='white'
                icon={peopleIcon}
                />
            
                <SidebarItem name='Registered' path='/admin/registeredUsers' 
                setActive ={set_activeItem} theActiveItem={activeItem}
                color='green'
                icon={peopleIcon}
                />
            
                <SidebarItem name='Absent' path='/admin/AbsentEmployees' 
                setActive ={set_activeItem} theActiveItem={activeItem}
                color='red'
                icon={peopleIcon}
                />
            
                <SidebarItem name='Inbox' path='/admin/recievedRequests'  
                setActive ={set_activeItem} theActiveItem={activeItem}
                color='white'
                icon={inboxICON}
                unSeenMSGs={unSeenMSGs>0? unSeenMSGs : ''}

                
                />
            
            
                <SidebarItem name='Send message' path='/admin/sendMessage' 
                setActive ={set_activeItem} theActiveItem={activeItem}
                color='white'
                icon={messageICON}
                
                />
             
            <div className={classes.logOut}  > 
            <Link to='/'> <img style={{cursor:'pointer'}} onClick={logOut} src={exitIcon} alt=''></img></Link>
                    <Spinner   margin='auto' size='3px' color='white'/>

            </div>
            </ul>
        </div>
    )
}

export default Sidebar