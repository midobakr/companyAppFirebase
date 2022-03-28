import classes from './historyTable.module.css'

const days = ['sunday' ,'monday','tuesday','wendthday','thrusday' ,'friday' , 'saturday']

function HistoryTable(props) {
    
    return(
        <div className={classes.container}>
        <table>
        <tr>
            <th>date</th>
            <th>time of leaving</th>
            <th>time of arriving</th>

            <th>day</th>

        </tr>
        {
            props.history.map((record)=>{
            let today_record = new Date(record.AttendAt)
            let today_record2 = new Date(record.LeftAt)
        
            return(
                <tr>
                    <td>
                            <span>{today_record.getFullYear()}</span>
                            <span>/{today_record.getMonth()+1}</span>
                            <span>/{today_record.getDate()}</span>
                        
                    </td>

                    <td>
                        <span>
                            {
                              today_record2.getHours()?  
                                today_record2.getHours()>12 ?
                                    today_record2.getHours()-12 +':'+today_record2.getMinutes() +' PM'
                                    :
                                    today_record2.getHours()+':'+today_record2.getMinutes() +' AM'    
                               :'' 
                            }
                        </span>
                    </td>
                    <td>
                        <span>
                            {
                                today_record.getHours()>12 ?
                                    today_record.getHours()-12 +':'+today_record.getMinutes() +'PM'
                                    :
                                    today_record.getHours()+':'+today_record.getMinutes() +'AM'    
                             }
                        </span>
                    </td>

                    <td>{days[today_record.getDay()]}</td>

                </tr>
             )
                 
            })
        }
        </table>
        </div>
    ) 
}

export default HistoryTable 