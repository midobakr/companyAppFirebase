import {useEffect , useState} from 'react'
function Timer({xx , setAllowed , normalMode}) {
    const [nowDate ,setNowDate] = useState(new Date().toLocaleTimeString())

        useEffect(()=>{
            const timer=  setInterval(()=>{
            if(normalMode){
                setNowDate(new Date().toLocaleTimeString())
            }else{
                let diffrence = +new Date() - +new Date(xx)
                
                let hours =Math.floor(diffrence/1000/60/60)
                hours =hours<10? `0${hours}` : hours  
                let minutes = new Date(diffrence).getMinutes()
                minutes= minutes<10?'0'+ minutes : minutes

                let secounds = new Date(diffrence).getSeconds()+1
                 secounds= secounds<10?'0' + secounds : secounds
                    
                setNowDate(
                    hours +
                    ":" + 
                    minutes +
                    ":" +
                    secounds
                )

                    if(hours>= 6 ){
                        setAllowed(false)
                    }
            }


            },1000)
            return ()=>{
                clearInterval(timer)
            }
        },[xx , setAllowed,normalMode])

       return nowDate
    
}

export default Timer