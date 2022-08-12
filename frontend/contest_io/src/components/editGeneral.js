import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";




export const EditGeneral = (props) =>{
    let userid = "0";

    const [idd, setidd] = useState("0");
  
    const location = useLocation();
  
    const [startdate, setstartdate] = useState();
    const [contest, setcontest] = useState({
        hostID: "",
        title: "",
        type: "",
        objective: "",
        description: "",
        voteWeight: "",
        juryVoteWeight: "",
        voterAnonymity: "",
        startTime: "",
        registrationEndTime: "",
        endTime: "",
    });
    
    
    useEffect(() => {
        const contestID = props;
        console.log("ContestId:",contestID);
        userid = localStorage.getItem("id");
    
        setidd(userid);
    
        axios.get("http://localhost:5000/api/contests/contest/" + contestID).then((res) => {
            console.log(res.data[0].hostID);
            setcontest({
              hostID: res.data[0].hostID,
              title: res.data[0].title,
              type: res.data[0].type,
              objective: res.data[0].objective,
              description: res.data[0].description,
              voteWeight: res.data[0].voteWeight,
              juryVoteWeight: res.data[0].juryVoteWeight,
              voterAnonymity: res.data[0].voterAnonymity,
              startTime: res.data[0].startTime,
              registrationEndTime: res.data[0].registrationEndTime,
              endTime: res.data[0].endTime,
            });
    
            console.log("time", res.data[0].registrationEndTime);
            console.log("second time", Date.parse(res.data[0].registrationEndTime));
    
            setstartdate(
              new Date(Date.parse(res.data[0].registrationEndTime) + 86400000)
            );
            console.log("start date", startdate)
          });
      }, [location]);

    const handleChange = (e) => {
        var { name, value } = e.target;
        if (name === "voterAnonymity") {
          if (e.target.checked) {
            value = 1;
          } else {
            value = 0;
          }
        }
        console.log(name, value);
        setcontest({
          ...contest,
          [name]: value,
        });
      };

    return (
        <>
        <div class="container">
                <h1 className="container text-center">Update</h1>
                
            </div>
            
        </>
      );
}