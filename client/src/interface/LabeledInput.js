import { useEffect, useState } from "react"
import { GAME_SETTINGS } from "../core/settings";

const LabeledInput = ({label, type, short, long, dark, top, bottom, min, max, step, gameProperty, exposed}) =>
{
    const gp = GAME_SETTINGS[exposed ? "Public" : "Private"][gameProperty]

    const [initVal, _] = useState(gp);
    const [val, setVal] = useState(gp);

    useEffect(() => 
    {
        setVal(gp)
    }, [gp])

    const onChange = (e) =>
    {
        GAME_SETTINGS[exposed ? "Public" : "Private"][gameProperty] = e.target.value

        setVal(e.target.value)
    }

    return <div className={`LabeledInput-module ${dark ? "dark" : ""} ${top ? "top" : ""} ${bottom ? "bottom" : ""}`}>
        <div className="LabeledInput-module--label">
            {label ? label : "Label"}
        </div>
        <input className={`LabeledInput-module--input ${long ? "long" : ""} ${short ? "short" : ""} ${val !== initVal ? "changed" : ""}`}
            type={type}
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={onChange} />
    </div>
}

export default LabeledInput