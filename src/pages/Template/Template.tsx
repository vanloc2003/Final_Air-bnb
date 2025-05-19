import { ReactNode } from 'react'
import Header from '../../components/Header/Header'
import FooterPage from '../../components/Footer/Footer'
import { Layout } from 'antd'
const { Content } = Layout
type TemplateProps = {
    children: ReactNode
}
export default function Template({ children }: TemplateProps) {
    return (
        <div>
            <Header />
            <Content>
                {children}
            </Content>
            <FooterPage />
        </div>
    )
}
