import {useSelector} from 'react-redux'
import classes from './profile.module.css'
import icon from './camera.svg'

function Profile({user , admin}) {
    let Firebase = useSelector(state =>state.firebase)
   
    async function  send(e){
         Firebase.updateProfilePicture(user.id , e.target.files[0])
    }
 
    return(
        <div className={classes.container}>
            <div>

            <label   for='profile-picture' className={classes.imageContainer}>
                <img className={classes.image}  
                src={user.avatar} 
                alt='' 
                />
{!admin &&    
                <div className={classes.icon}>
                    <input style={{display:'none'}} id='profile-picture' type='file' name='file' onChange={send}></input>    
                <img  style={{width:'25px'}} src={icon} alt='profile ' />
                </div>
                
}
            </label> 
            </div>
   
           <div className={classes.container2}> 
                <div className={classes.box}>
                    <h2 className={classes.label}>your name:</h2>
                    <h2>{user.username}</h2>
                </div>
                <div className={classes.box}> 
                    <h2  className={classes.label}>your Email:</h2>
                    <h2>{user.email}</h2> 
                </div>
                <div className={classes.box}>
                    <h2 className={classes.label}>Date of Employment:</h2>
                    <h2>{new Date(user.dateOfEmployment).toLocaleDateString()}</h2>
                </div>
            </div>

        </div>
    )
}

export default Profile