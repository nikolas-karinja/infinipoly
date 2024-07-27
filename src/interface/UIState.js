const UIState = ({visible, children}) =>
{
    return <div className='UIState-module'
        style={{display: visible ? 'block' : 'none'}}>
        {children}
    </div>
}

export default UIState