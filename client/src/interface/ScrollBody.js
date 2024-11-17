const ScrollBody = ({className, children, scrollX, scrollY = true}) =>
{
    return <div className={`ScrollBody-module ${className} ${scrollX ? "scrollX" : ""} ${scrollY ? "scrollY" : ""}`}>
        {children}
    </div>
}

export default ScrollBody