

import { Roboto } from 'next/font/google'
import Head from 'next/head'
import ChartA from '@/components/ChartA'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const roboto = Roboto({ subsets: ['latin'], weight: ["100", "300", "400", "500", "700", "900"] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Pison - Test - V1 - Next.js + SWR + Chart.js</title>
      </Head>
      <main className={"flex min-h-screen flex-col items-center justify-between p-24 " + roboto.className}>

        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <ChartA />
        </div>
      </main>
    </>
  )
}
