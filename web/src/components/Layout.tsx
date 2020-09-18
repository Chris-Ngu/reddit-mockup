import { Nav } from './Nav'
import { Wrapper, WrapperVarient } from './Wrapper'

interface LayoutProps {
    variant?: WrapperVarient
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
    return (
        <>
            <Nav />
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
        </>
    )
}