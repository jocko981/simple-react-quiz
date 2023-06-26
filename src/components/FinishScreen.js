function FinishScreen({ points, maxPoints, highscore, dispatch }) {
  const percentage = (points / maxPoints) * 100;
  let emoji;
  if (percentage > 90) emoji = "🥇";
  if (percentage >= 75 && percentage <= 90) emoji = "🎉";
  if (percentage > 50 && percentage < 75) emoji = "😁";
  if (percentage < 50) emoji = "🙉";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}
        &#37;)
      </p>
      <p className="highscore">Your Highscore: {highscore} points</p>
      <button className="btn btn-ui" onClick={() => dispatch({ type: "restart" })}>
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
