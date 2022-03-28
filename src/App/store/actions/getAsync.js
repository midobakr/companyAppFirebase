import * as Actions from "./actions";

const getAsync = (path, Actiontype) => async (dispatch, getState) => {
  dispatch({
    type: Actions.GET_DATA,
  });

  try {
    let Response = await fetch(path, {
      // let Response = await fetch('http://192.168.1.8:3333'+ path, {
      method: "GET",
      headers: {
        Authorization: getState().token,
      },
    });

    if (Response.ok) {
      Response = await Response.json();
      if (Actiontype) {
        dispatch({
          type: Actiontype,
          payload: Response,
        });
      }
      return Response;
    } else {
      Response = await Response.json();
      throw Response;
    }
  } catch (e) {
    if (e.errors) {
      dispatch({ type: Actions.SET_ERRORS, payload: e.errors[0] });
    } else {
      dispatch({ type: Actions.SET_ERRORS, payload: { msg: "error" } });
    }
    throw e;
  }
};
export default getAsync;
