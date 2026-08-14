import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import Main from './_components/Main'
import TodayStudySpark from './_components/TodayStudySpark'

function Dashboard() {
  return (
    <div>
      <TodayStudySpark />
      <WelcomeBanner />
      <Main />
    </div>
  )
}

export default Dashboard