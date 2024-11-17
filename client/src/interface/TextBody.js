const TextBody = ({className, children, left, right, center, warning}) =>
{
    return <div className={`TextBody-module ${left? "left" : ""} ${right? "right" : ""} ${center? "center" : ""} ${warning? "warning" : ""} ${className}`}>
        {children}
    </div>
}

export default TextBody