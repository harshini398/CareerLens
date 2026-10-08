import { useState } from 'react'

export default function WeightSlider({ label, value = 20, onChange }) {
  const [current, setCurrent] = useState(value)

  const update = (next) => {
    setCurrent(next)
    onChange?.(next)
  }

  return (
    <label className="career-weight-slider">
      <span className="career-weight-heading"><strong>{label}</strong><b>{current}%</b></span>
      <input type="range" min="0" max="100" value={current} onChange={(event) => update(Number(event.target.value))} />
      <span className="career-weight-scale"><small>0%</small><small>50%</small><small>100%</small></span>
    </label>
  )
}
