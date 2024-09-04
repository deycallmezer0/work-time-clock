import EmployeeList from '@/components/EmployeeList'
import ReportGenerator from '@/components/ReportGenerator'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Employee Time Clock & Paycheck Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Employee Time Clock</h2>
          <EmployeeList />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Paycheck Report Generator</h2>
          <ReportGenerator />
        </section>
      </div>
    </main>
  )
}
