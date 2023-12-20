import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
const user = JSON.parse(localStorage.getItem("user"));

function decapitalizeFirstLetter(string) {
  return string.replace(/\b(\w)/g, (s) => s.toLowerCase());
}
const BACKEND = process.env.REACT_APP_BACKEND
const Topic = () => {
  const params = useParams();
  const [questionsByType, setQuestionsByType] = useState([]);
  const [doneQuestionsByType, setDoneQuestionsByType] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(params);
  const handleCheck = (e, question) => {
    console.log(question);
    const body = { id: question._id, username: user.username };
    if (doneQuestionsByType?.includes(question)) {
      setDoneQuestionsByType(
        doneQuestionsByType.filter((item) => item !== question)
      );
      fetch(BACKEND+"/auth/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); 
        })
        .then((data) => {
          console.log("Success:", data); 
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      fetch(BACKEND+"/auth/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); 
        })
        .then((data) => {
          console.log("Success:", data); 
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setDoneQuestionsByType([...doneQuestionsByType, question]);
    }
  };
  useEffect(() => {

    if (!currentUser) {
      fetch(BACKEND+"/auth/" + user?.username)
        .then((response) => response.json())
        .then((user) => {
          setCurrentUser(user.user);
        });
    }
    fetch(BACKEND+"/questions")
      .then((response) => response.json())
      .then((questions) => {
        const groupedAllQuestions = questions.reduce((acc, question) => {
          if (!acc[question.type]) {
            acc[question.type] = [];
          }
          acc[question.type].push(question);
          return acc;
        }, {});

        if (currentUser) {
          const groupedDoneQuestions = questions.reduce((acc, question) => {
            if (currentUser.doneQuestions.includes(question._id)) {
              if (!acc[question.type]) {
                acc[question.type] = [];
              }
              acc[question.type].push(question);
            }
            return acc;
          }, {});
          let list = groupedDoneQuestions[decapitalizeFirstLetter(params.type)]
            ? groupedDoneQuestions[decapitalizeFirstLetter(params.type)]
            : [];
          setDoneQuestionsByType(list);
        }
        console.log(groupedAllQuestions);
        setQuestionsByType(
          groupedAllQuestions[decapitalizeFirstLetter(params.type)]
         
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching questions:", error);
      });
  }, [currentUser]);

  return (
    <>
       {loading?<Loading/>:<div className="question-list">
        <div className="go-to-main" onClick={()=>navigate('/')}>Home</div>
        <h2 className="topic-title">
          {params.type}
          <h4>{doneQuestionsByType.length}/{questionsByType.length}</h4>
        </h2>
        {questionsByType?.map((question) => {
          return (
            <div
              className={
                doneQuestionsByType?.includes(question)
                  ? "question bg-green"
                  : "question"
              }
            >
              <a href={question.link}>{question.questionName}</a>
              <input
                className="check"
                type="checkbox"
                checked={doneQuestionsByType?.includes(question)}
                onChange={(e) => handleCheck(e, question)}
              />
            </div>
          );
        })}
      </div>}
      
    </>
  );
};

export default Topic;
