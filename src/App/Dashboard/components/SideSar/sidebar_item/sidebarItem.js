import {Link} from "react-router-dom";

import classes from "./sidebarItem.module.css"; 
 
function sidebarItem(props) {
    const isActive = props.theActiveItem===props.path

    return(
        <li className={classes.sidebar_item}
            
        onClick={function (e){
            props.setActive(props.path);
            e.currentTarget.scrollIntoView({block:'start',inline: "center", behavior:"smooth"}) 
       }}  
        >
           <Link className={classes.Link} to={props.path}>
            <div className={classes.icon} style={{marginRight:'10px',
                         backgroundColor:props.color,
                         WebkitMask:`url(${props.icon}) no-repeat center`,
                         }}></div>
           <span className={classes.name} style={{verticalAlign:'middle',color :isActive? '#1A92DC':''}} >{props.name}</span>   
           <span style={{marginLeft:'10px' , color:'red' , fontWeight:'bolder'}}>{props.unSeenMSGs}</span>

            </Link>
           
</li>
    ) 
} 

export default sidebarItem
