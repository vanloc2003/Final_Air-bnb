import { useMediaQuery } from "react-responsive"

export const CheckMobilePhone = ({ children }: any) => {
    const isMobile = useMediaQuery({
        minWidth: "0px",
        maxWidth: "500px",
    })
    return isMobile ? children : null;
}
export const CheckTablet = ({ children }: any) => {
    const isTablet = useMediaQuery({
        minWidth: "501px",
        maxWidth: "1024px",
    })
    return isTablet ? children : null;
}
export const CheckDesktop = ({ children }: any) => {
    const isDesktop = useMediaQuery({
        minWidth: "1025px",
    })
    return isDesktop ? children : null;

}