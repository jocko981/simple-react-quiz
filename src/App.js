import { useReducer } from "react";
import jsonData from "./data/questions.json";
//components
import Header from "./components/Header";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import NextButton from "./components/NextButton";
import Timer from "./components/Timer";

const SEC_PER_QUESTION = 32;
const initialState = {
  questions: jsonData.questions,
  status: "ready", //app status: loading, error, ready, active, finished
  questionIndex: 0,
  answer: null, //question answer index
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(currState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...currState, status: "ready", questions: action.payload };

    case "dataFailed":
      return { ...currState, status: "error" };

    case "start":
      return {
        ...currState,
        status: "active",
        secondsRemaining: currState.questions.length * SEC_PER_QUESTION,
      };

    case "newAnswer":
      const question = currState.questions.at(currState.questionIndex);
      return {
        ...currState,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? currState.points + Number(question.points)
            : currState.points,
      };

    case "nextQuestion":
      return { ...currState, questionIndex: currState.questionIndex + 1, answer: null };

    case "finish":
      const newScore = currState.points > currState.highscore ? currState.points : currState.highscore;
      return { ...currState, status: "finished", highscore: newScore, answer: null };

    case "restart":
      return {
        ...initialState,
        status: "active",
        questions: currState.questions,
        secondsRemaining: currState.questions.length * SEC_PER_QUESTION,
      };

    case "tick":
      const checkedStatus = currState.secondsRemaining <= 0 ? "finished" : currState.status;
      return { ...currState, status: checkedStatus, secondsRemaining: currState.secondsRemaining - 1 };

    default:
      throw new Error("Unknown action type");
  }
}

function App() {
  const [{ questions, status, questionIndex, answer, points, highscore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);
  // destructure right away here
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, currVal) => prev + currVal.points, 0);

  return (
    <div className="app">
      <Header />
      <main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              questionIndex={questionIndex}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question question={questions[questionIndex]} dispatch={dispatch} answer={answer} />
            <footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                questionIndex={questionIndex}
                numQuestions={numQuestions}
              />
            </footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen dispatch={dispatch} highscore={highscore} points={points} maxPoints={maxPoints} />
        )}
      </main>
    </div>
  );
}

export default App;
