import {useSelector} from "react-redux";

import classes from './guest.module.css';
import AdminAvatar from './profile.svg';
import EmployeeAvatar from './man.svg';

function Guest() {
  
  const Firebase = useSelector(store=>store.firebase)
 
  let sendData =async (status)=>{
    await  Firebase.doSignInAnonymously(status)  
  } 
  
  return (
    <div className={classes.container}>
        <h1 style={{textAlign:'center'}}>Enter As A guest</h1>
    <div  style={{display:'flex',justifyContent:'space-around'}}>
        <div onClick={()=>{sendData('admin')}} style={{textAlign:'center'}}>
        <img src={AdminAvatar} style={{width:'75%',height:'400px'}} alt=''/>
        <h2 >Manager</h2>
        </div>
        <div onClick={()=>{sendData('employee')}} style={{textAlign:'center'}}>
        <img src={EmployeeAvatar} style={{width:'75%',height:'400px'}} alt=''/>
        <h2 >Employee</h2>
        </div>
    </div>
    </div>
  );
}


export default Guest;
