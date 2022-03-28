import * as Actions from "./actions";


 const postAsync = (path  ,body,actionType=Actions.SET_TOKEN) => async (dispatch, getState) => {
    dispatch({
        type: Actions.GET_DATA
    })
    try {
        let Response = await fetch(path, {
        // let Response = await fetch('http://192.168.1.8:3333'+ path, {
            method: 'POST',
            headers: {
                Authorization: getState().token,
                'Content-Type':'application/json' 
            },
            body: JSON.stringify(body)
        })
    
        if(Response.ok){
            const Data = await Response.json();
            dispatch({
                type :actionType,
                payload: Data
            })
                return Data
        }else{
            Response = await Response.json() 
            throw (Response)
        }


    } catch (e) {
        if(e.errors){
            dispatch({type : Actions.SET_ERRORS,payload:e.errors[0]})
            return e.errors[0]
        }
    }


}
export default postAsync