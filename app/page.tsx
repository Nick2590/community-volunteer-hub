export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <a href="#home" className="text-lg font-bold text-emerald-800">
            Community Volunteer Hub
          </a>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-5 text-sm font-medium text-slate-700">
              <li>
                <a className="hover:text-emerald-700" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-700" href="#opportunities">
                  Opportunities
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-700" href="#sign-in">
                  Sign In
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="home" className="flex-1">
        <section className="bg-emerald-800 px-6 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Make a Difference in Your Community
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              Discover local volunteer opportunities and connect with organizations that need your help.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#opportunities"
                className="rounded-md bg-white px-5 py-3 text-center font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-800"
              >
                Browse Opportunities
              </a>
              <a
                href="#post-opportunity"
                className="rounded-md border border-white px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-800"
              >
                Post an Opportunity
              </a>
            </div>
          </div>
        </section>

        <section id="opportunities" className="px-6 py-16 sm:py-20" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="how-it-works-heading" className="text-center text-3xl font-bold text-slate-900">
              How It Works
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-800">Find Opportunities</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Explore volunteer projects from local organizations in your community.
                </p>
              </article>
              <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-800">Sign Up to Help</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Choose an opportunity that fits your interests, skills, and schedule.
                </p>
              </article>
              <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-800">Make an Impact</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Lend a hand and help strengthen the place you call home.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer id="sign-in" className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-600">
        <p id="post-opportunity">Community Volunteer Hub</p>
      </footer>
    </div>
  );
}
