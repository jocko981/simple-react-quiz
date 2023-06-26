function NextButton({ answer, dispatch, questionIndex, numQuestions }) {
  if (answer === null) return;

  if (questionIndex === numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "finish" })}>
        See Results
      </button>
    );
  }

  if (questionIndex < numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "nextQuestion" })}>
        Next
      </button>
    );
  }
}

export default NextButton;
