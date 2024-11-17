const TextBody = ({children, left, right, center, warning}) =>
{
    return <div className={`TextBody-module ${left? "left" : ""} ${right? "right" : ""} ${center? "center" : ""} ${warning? "warning" : ""}`}>
        {children}
    </div>
}

export default TextBody