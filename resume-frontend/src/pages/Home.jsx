import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-slate-800">Resume ATS Analyzer</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 text-slate-700 hover:text-slate-900 font-medium transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium"
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-slate-900 leading-tight">
              Optimize Your Resume for ATS Success
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Get instant feedback on how well your resume matches job descriptions.
              Improve your chances of getting past Applicant Tracking Systems and landing interviews.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Instant ATS Score</h3>
                  <p className="text-slate-600">Get real-time feedback on your resume compatibility</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Keyword Matching</h3>
                  <p className="text-slate-600">Identify missing keywords and improve your content</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Actionable Suggestions</h3>
                  <p className="text-slate-600">Receive personalized improvement recommendations</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Start Analyzing Your Resume
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Professional resume review"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6">
                <p className="text-white font-semibold text-lg">
                  Stand out from the competition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
