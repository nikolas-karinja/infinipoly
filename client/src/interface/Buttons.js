const Buttons = ({className, vert, final, children}) =>
{
    return <div className={`Buttons-module ${className} ${vert ? 'vert' : ''} ${final ? 'final' : ''}`}>
        {children}
    </div>
}

export default Buttons