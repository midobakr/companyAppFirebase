let myPromise = (path) =>
  new Promise(async (myResolve, myReject) => {
    try {
      let Response = await fetch(path, {
        // let Response = await fetch('http://192.168.1.8:3333'+ path, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (Response.ok) {
        Response = await Response.json();

        myResolve(Response);
      } else {
        Response = await Response.json();
        myReject(Response);
      }
    } catch (e) {}
  });
export default myPromise;
