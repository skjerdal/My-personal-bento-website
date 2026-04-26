/* global React, ReactDOM */

function App() {
  return (
    <>
      <div className="bento">
        {/* row 1+2: hero (2x2), booster (1x2), stats (1x1) */}
        <HeroCard />
        <BoosterSlot />
        <StatsCard />
        <StackCard />

        {/* row 3+4 */}
        <ProjectsCard />
        <WorkCard />

        {/* row 5+6 */}
        <EducationCard />
        <ActivitiesCard />
        <ContactCard />
      </div>
      <div className="foot">© 2026 · Thomas Skjerdal · Built with too much coffee</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
