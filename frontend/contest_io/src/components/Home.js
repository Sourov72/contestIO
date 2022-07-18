import React from "react";
export const Home = (props) => {
    return(
      <div id='backgroundimage1'>
        <div >
          <h1 style={{color:'#34eb8c',textAlign:'center',alignContent:'center'}}>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <span class="span-block" ><h1>Join our Comunity</h1></span>
          <span class="span-block" ><h1>and</h1></span>
          <span class="span-block" ><h1>Host/Particpate for FREE!!</h1></span>
          </h1>
          <div class="containercenter" >
          <div class="centerbutton">
          <a class="d-flex" href="/about"><button class="btn btn-success px-4">Learn More</button></a>
          <br></br>
          <a class="d-flex" href="/signup"><button class="btn btn-warning px-4 mx-2">Join Now</button></a>
          </div>
          </div>
        </div>
      </div>
    );
};