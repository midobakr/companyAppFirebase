let myPromise = (path, body) =>
  new Promise(async (myResolve, myReject) => {
    // "Producing Code" (May take some time)
    try {
      let Response = await fetch(path, {
        //   let Response = await fetch('http://192.168.1.8:3333'+ path, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
