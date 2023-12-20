import * as React from "react";

import { useNavigate } from "react-router-dom";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";
function capitalizeFirstLetter(string) {
  return string.replace(/\b(\w)/g, (s) => s.toUpperCase());
}
function decapitalizeFirstLetter(string) {
    return string.replace(/\b(\w)/g, (s) => s.toLowerCase());
  }
export default function TopicCard({ card }) {
  const navigate = useNavigate();
  const type = card.type;
  
  card.type = capitalizeFirstLetter(card.type);
  return (
    <div className="home-card" onClick={() => navigate("/topics/" + type)}>
      <div className="left">
        <h2>{card.type}</h2>
        <h4>Total Questions:{card.totalQuestions}</h4>
        <h4>Done Questions :{card.doneQuestions}</h4>
        <div className="progress-container">
        <MDBProgress height="20" >
          <MDBProgressBar width={Math.round(card.doneQuestions/card.totalQuestions*100)} style={{backgroundColor:"#3ac96c"}} valuemin={0} valuemax={100}>
          </MDBProgressBar>
        </MDBProgress>
        <span>{Math.round(card.doneQuestions/card.totalQuestions*100)}%</span>
        </div>
      </div>
      <div className="right">
        <img src={'/assets/'+decapitalizeFirstLetter(card.type).trim()+'.png'} alt="card img" />
      </div>
      
    </div> 
  );
}
