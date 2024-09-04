import EmployeeList from '../components/EmployeeList'

import EmployeeList from '@/components/EmployeeList'
import ReportGenerator from '@/components/ReportGenerator'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Employee Time Clock & Paycheck Calculator</h1>
      <div className="space-y-8">
        <EmployeeList />
        <ReportGenerator />
      </div>
    </main>
  )
}
