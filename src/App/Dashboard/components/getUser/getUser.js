import classes from "./getUser.module.css";
import {useEffect , useState} from "react";
import {useParams , useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

import Spinner from "../../../employee/Components/UI/spinner/spinner";
import HistoryTable from "../historyTable/historyTable";
import TextUser from "../textUser/textUser";
import Profile from "../../../employee/Components/Profile/profile";

let myDivs = ['profile' ,'history' , 'messages'] 

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function GetUser() {
    const {id} = useParams();
    let active_section = useQuery().get('active') ||0
    let Firebase = useSelector(state => state.firebase)

    const [activeDiv , setActiveDiv] = useState(+active_section)
    const [user , setUser] = useState(null)
    const [error , setError] = useState(null)
    const [loading , setLoading] = useState(false)
         
    let submit = ()=>{
        if(activeDiv=== 2){
            setActiveDiv(0)
            return;
        }
           setActiveDiv(activeDiv+1)
        
    }
    useEffect(()=>{
        setLoading(true)
        Firebase.getUser(id).then((res)=>{
            setUser(res.val())
            setLoading(false)
        }).catch(e=>{
            setError('error')
            setLoading(false)
        })

    },[id ,Firebase])

    if(error){
        return <h1 style={{margin:'auto'}}>{error}</h1>
    }

    if(loading){
        return <div style={{margin:'auto'}}>
            <Spinner show margin='auto'/>
        </div>
    }
    return(
        user ? 
        <div className={classes.container}>
    
        {activeDiv ===0 ?<div className={classes.profileContainer}>
                            <Profile admin={true} user={user}/>
                            </div> : ''} 
                                    
            {activeDiv ===1 ? <HistoryTable user={user}/> : ''} 
            
            {activeDiv ===2 ?
            <div className={classes.textContainer}>
            <TextUser ID={id} myUser={user}/>
            </div>
             :''}
            <button onClick={submit}className={classes.button}>Go to {myDivs[activeDiv+1] || 'profile'}</button>

        </div>
        :''

    )
    
}

export default GetUser