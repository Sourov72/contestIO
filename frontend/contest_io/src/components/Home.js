import React from "react";
export const Home = (props) => {
    return(
      <div id='backgroundimage1'>
        <div >
          <h1 style={{color:'#34eb8c',textAlign:'center',alignContent:'center'}}>
          <br></br>
          <br></br>
          <br></br>
          <span className="span-block" >Join our Comunity</span>
          <span className="span-block" >and</span>
          <span className="span-block" >Host/Particpate for FREE!!</span>
          </h1>
          <div className="containercenter" >
          <div className="centerbutton">
          <a className="d-flex" href="/about"><button className="btn btn-success px-4">Learn More</button></a>
          <br></br>
          <a className="d-flex" href="/signup"><button className="btn btn-warning px-4 mx-2">Join Now</button></a>
          </div>
          </div>
        </div>
      </div>
    );
};