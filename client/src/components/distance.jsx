const commutesPerYear = 260 * 2;
const litersPerKM = 10 / 108;
const gasLiterCost = 1.5;
const literCostKM = litersPerKM ^ gasLiterCost;
const secondsPerDay = 60 * 60 * 24;


export default function Distance({leg}) {
    console.log(leg.steps)
    
    if (!leg.distance || !leg.duration) return null

    return (
    <>
    <br/>
    <br/>
    <div>Distance to Selected Facility: {leg.distance.text}</div>
    <br/>
    <div>Expected Travel Duration: {leg.duration.text}</div>
    <br/>
    <div>
        {leg.steps.map((step, index) => (
          <div key={index}>
            <p>Instructions: <span dangerouslySetInnerHTML={{ __html: step.instructions }} /></p>
            <p>Distance: {step.distance.text}</p>
            <p>Duration: {step.duration.text}</p>
          </div>
        ))}
      </div>

    </>
    )
}