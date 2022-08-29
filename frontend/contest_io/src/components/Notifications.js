import React, { useEffect, useState } from "react";
import axios from "axios";

let Notify=[];
export const Notification = () => {
    
    useEffect(() => {
        const folQ = {
            userID:localStorage.getItem("id"),
        };
        //console.log("sdahfj");
        axios
        .get("http://localhost:5000/api/follow/getNotification", {
            params:folQ,
        })
        .then((res) => {
          Notify.push("Res");

        });
    });
    return(
      <div>
        {Notify.length > 0 ? (
        <>
          {/* {console.log("cotn", contests[0])} */}
          {Notify.map((notif) => {
            <div>
            <h1>{notif}</h1>
            <br></br>
            </div>
          })}
        </>
      ) : (
        <div>
          <h1>No Notification</h1>
        </div>
      )}
      </div>
    );
};

