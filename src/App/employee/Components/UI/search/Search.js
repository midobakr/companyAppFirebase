import classes from './search.module.css'
import searchIcon from './search.png';

export default function Search({action , fullArray}) {
    function search  (e){
        let result = e.target.value;
        if (result === '') {
            action(fullArray)
        }

        let tmb_array = fullArray.filter(user => {
            return user.username.toLowerCase().match(result.toLowerCase()) ? user : '';
        })
        if(!tmb_array[0]){
            tmb_array=[]
        }
        action(tmb_array)
    }
 
    return (    
        <div className={classes.search}>
            <div style={{display:'inline-block',position:'relative' }}>
                <input type='text' className={classes.input} 
                onChange={search}
                ></input>
                <span className={classes.searchIcon} >
                    <img src={searchIcon} alt=""></img>
                </span>
            </div>
        </div>
    )
}