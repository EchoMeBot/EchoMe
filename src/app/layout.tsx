import './globals.css'
//import { useRouter } from 'next/router'
import { Header } from '@/components/Header'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ServerThemeProvider } from 'next-themes'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    //const router = useRouter();

    //const handleGoToMain = () => {
    //    router.push('/main');
    //};


    return (
        <ServerThemeProvider attribute="class">
            <html lang="ko" className="h-full">
                <head />
                <body className="flex h-full flex-col bg-grey-light dark:bg-grey-dark">
                    <ThemeProvider attribute="class">
                        <Header>
                            <button>◀️</button>
                            <h1>AboutME</h1>
                            <ThemeToggle />
                        </Header>
                    </ThemeProvider>
                    <main className="flex h-full flex-grow flex-col overflow-hidden">
                        {children}
                    </main>
                    <Analytics />
                </body>
            </html>
        </ServerThemeProvider>
    )
}