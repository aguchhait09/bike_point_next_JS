
interface wrapperProps{
    children: React.ReactNode
}

const Wrapper = (props: wrapperProps) => {
    const {children} = props
  return (
    <>
        <main style={{height: "auto"}}>
            {children}
        </main>
    </>
  )
}

export default Wrapper