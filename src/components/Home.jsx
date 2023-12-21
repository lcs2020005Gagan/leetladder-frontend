import React, { useState, useEffect } from "react";
import Card from "./Card";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";
import Loading from "./Loading";
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const BACKEND = 'http://localhost:5000'
console.log(BACKEND);
const Home = () => {
  const [questionsByType, setQuestionsByType] = useState({});
  const [doneQuestionsByType, setDoneQuestionsByType] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [allQuestionCount, setAllQuestionCount] = useState(0);
  const [doneQuestionCount, setDoneQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log(doneQuestionCount);
  console.log(allQuestionCount);

  useEffect(() => {
    if (!currentUser) {
      fetch(BACKEND + '/auth/'+user?.username)
        .then((response) => response.json())
        .then((user) => {
          setCurrentUser(user.user);
        });
    }
    let cnt = 0;
    fetch(BACKEND+"/questions")
      .then((response) => response.json())
      .then((questions) => {
        const groupedAllQuestions = questions.reduce((acc, question) => {
          if (!acc[question.type]) {
            acc[question.type] = [];
          }
          acc[question.type].push(question);
          cnt++;
          return acc;
        }, {});
        setAllQuestionCount(cnt);
        cnt=0;
        if (currentUser) {
          const groupedDoneQuestions = questions.reduce((acc, question) => {
            if (currentUser.doneQuestions.includes(question._id)) {
              if (!acc[question.type]) {
                acc[question.type] = [];
              }
              acc[question.type].push(question);
              cnt++;
            }
            return acc;
          }, {});
          setDoneQuestionCount(cnt);
          setDoneQuestionsByType(groupedDoneQuestions);
        }
        console.log(groupedAllQuestions);
        setQuestionsByType(groupedAllQuestions);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [currentUser]);
  return (
    <>
      {loading?<Loading/>:
      <>
      <div className="logout" onClick={()=>{
        localStorage.clear('user');
        window.location.reload();
      }}>Logout</div>
      <div className="home-container">
        <img src={"/assets/logo.png"} alt="logo" />
        <h2 className="title">LeetLadders</h2>
      </div>
      <MDBProgress height="7" style={{ width: "80%", margin: "0 auto" }}>
        <MDBProgressBar
          width={Math.round((doneQuestionCount / allQuestionCount) * 100)}
          style={{ backgroundColor: "#3ac90f" }}
          valuemin={0}
          valuemax={100}
        ></MDBProgressBar>
      </MDBProgress>
      <div className="value">
        {Math.round((doneQuestionCount / allQuestionCount) * 100)}% completed
      </div>
      <div className="home">
        {Object.keys(questionsByType).map((type) => (
          //   <div key={type} className='home'>
          <Card
            card={{
              type: type,
              totalQuestions: questionsByType[type].length,
              img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Binary_tree_v2.svg",
              doneQuestions: doneQuestionsByType[type]
                ? doneQuestionsByType[type].length
                : 0,
            }}
          />
        ))}
      </div>
      <div className="footer">
        Made by <a href="https://leetcode.com/neembu_mirch/">Neembu_Mirch</a>
      </div>
      </>
}
    </>
  );
};

export default Home;
