function Recommendations({ recommendations }) {
  return (
    <section className="recommendations-section">
      <h2>Recommended Products</h2>
      <div className="recommendations">
        {recommendations.length ? (
          recommendations.map((rec, index) => <p key={index}>{rec}</p>)
        ) : (
          <p>Ask a question to see tailored investment options!</p>
        )}
      </div>
    </section>
  );
}

export default Recommendations;
