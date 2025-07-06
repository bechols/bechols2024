import { createFileRoute } from '@tanstack/react-router'
import Markdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const worldviewMarkdown = `
* **We have to live with lots of uncertainty. We're never going to know as much as we want. Many questions don't have answers at all.**
  
  * I was a philosophy major (yeah, yeah). I have been astounded at how relevant [epistemological thinking](https://en.wikipedia.org/wiki/Epistemology) has been in my career as a PM.
  * It's hard to learn stuff. The more valuable an answer is, the harder it is for us to determine a definite answer with an experiment (usually). It's easy to suggest A/B tests in software products. They're great for some contexts, but we can't A/B test a strategy or core product bets. That doesn't mean we can't define feedback loops to assess them, but we shouldn't conflate those signals with a high level of certainty.
  * Error ranges and confidence intervals are an underused concept. "How much sooner will team X finish project Y if we change Z?" is the type of question that often doesn't have a meaningful answer more precise than "Sooner...maybe." because the error bars are usually larger than any of the absolute values in play. I haven't yet worked in an organization or seen a tool that handles this well. Makes sense, because people don't like uncertainty.
  
* **We're never just creating or changing a product. We're also evolving the system that creates the product.**
  
  * No one product change/feature is worth compromising the health of the system. We need to be able to take lots of shots. No one shot can win the game. That doesn't mean we don't do hard things, or make compromises, but those calls should always be made with the system in mind. Thinking about James Carse on infinite vs. finite games: let's play the infinite game.
  * The people in the system should be fulfilled, incentivized on the actual desired outcomes, clear on what those outcomes are, etc. Smart people with the same incentives and the same information generally don't disagree on fundamentals - if we're stuck on something, step back to make sure we're in fact working from the same information toward the same goal(s).
  * Problems are opportunities to update the system to gracefully handle or entirely prevent that category of problem.  
  * Gardening is generally a better analogy for building software products than physical engineering.  
  
* **Don't assume that what we're doing is the best thing for us to be doing.**
  * It's easier to assume that a given goal/mission/project is the best thing you could be doing. PMs need to periodically challenge this assumption at different levels - specific interfaces, entire features, product structures, even at the category and company level.
  * Salience matters a lot. Errors often come from neglecting information someone knew but that we overlooked, not fundamentally unknowable gambles. Since humans prefer simplicity, it's a constant battle to keep all the relevant dimensions in everyone's minds when we're working on hard problems. When we forget key dimensions, we go in circles - endless meetings, people talking past one another, abortive decisions that are obviously unworkable when thinking about an overlooked aspect.

* **Even if we're doing the right thing, don't assume we need to do more of what we're doing.**
  * "[Half-ass it with everything you've got - target the right level of outcome(s) and invest appropriately vs. maximizing effort on any one dimension](http://mindingourway.com/half-assing-it-with-everything-youve-got/)"
`

const workdayMarkdown = `
* Learning something surprising: from customers, coworkers, our systems, and/or the broader world.
* Thinking hard: writing about, diagramming, and/or analyzing data for a complex problem.
* Creating leverage: create a writeup or recommendation for a complex problem, get a hard decision right, refocus discussion on the highest impact dimensions, create a reusable resource, etc.
* Human interaction with smart people: face to face conversation with teammates.
`

const communicationMarkdown = `
* If it's complicated:
  * If a writeup doesn't already exist: create the writeup and share with me async. I'll read it, comment, and we can discuss.
  * If a writeup already exists and we're not making progress: let's discuss live.
* If it's not complicated:
  * For questions/actions that are documented and/or have an established process: zero communication. Read the manual, follow the process, etc. If the docs or process don't work, tell me - I want to help fix them!
  * For new questions: please ask in a shared forum if possible instead of a direct 1:1 communication.
    * Others likely have a similar question so it's valuable for them to see the discussion
    * It gives others the chance to respond before I see it.
    * I may not know the answer at all, or be missing info someone else has.
    * Asking publicly sets us up to permanently document the answer somewhere (now it's at least in Slack search or equivalent) so future instances can be self served.
* In general: I'm good at staying on top of lots of sources of information (Slack channels, wiki pages, Jira tickets, pull requests, emails, etc) and responding quickly, so choice of channel isn't critical. Sometimes to the detriment of deeper work.
`

const qualitiesMarkdown = `
* Accuracy in inputs and outputs. I appreciate when people take care to get details right.
* ROI/marginal return thinking, not focusing on absolutes or idealized situations.
  * Talking about what we'd do with unlimited resources is sometimes useful for brainstorming, but most of the time distracts from hard tradeoffs we need to make.
* Systems thinking.
  * Keep track of all the moving parts. Don't focus on one goal or element to the detriment of the rest.
`

const misunderstandingMarkdown = `
* I have a strong default instinct to say yes that I'm constantly fighting with as I say no to most requests.
`

const stressMarkdown = `
* Punting important decisions.
  * If it's important to decide, decide it ASAP and make sure someone's owning the decision.
  * If it's not important, that's ok. There will always be lots of stuff we don't know.
* Coworkers ignoring resources.
  * Everyone's busy. I know it'd be easier if someone would just tell you the exact thing you want to know. But there are too many things to know! I try to create internal and customer facing docs to get some leverage. We're usually doing new and difficult things, and the answers often aren't simple, so having a complete response instead of a quick reply in chat is important for getting it right.
  * Finding those resources and knowing whether they're up to date is often difficult - discovery is a hard problem! I'm happy to help point you in the right direction (or to fix errors/gaps, as is frequently necessary) but once you know where to look, please actually use those resources.
* Duplicate communication across multiple channels. Please don't simultaneously ask me a question in two Slack channels and via email. Please don't simultaneously tag me in a PR and comment in a Jira ticket. I'm very good at staying on top of lots of sources of information (Slack channels, wiki pages, Jira tickets, pull requests, emails, etc) and responding quickly (sometimes to the detriment of deeper work).
`

const bestOutMarkdown = `
* Clearly define the end result you want from me, along with any relevant constraints.
* Cut me off if I'm monologuing.
`

const disagreeMarkdown = `
* Openly. If I realize we disagree on a fundamental or upstream issue, I want to focus on that, rather than the downstream issue we may have been discussing.
* I try to anticipate and address potential objections. Sometimes this means I don't state my basic position as clearly as I should.
`

const supportMarkdown = `
* Openly, but often after failing to make progress. I'll admit when I don't know how to move forward, or don't understand the ask.
`

const motivationMarkdown = `
* Making an outsized impact. I like working on zero to one problems more than incremental improvements. I will always look for a way to eliminate a category of problem instead of fixing individual issues. Sometimes this is overkill.
* Understanding how complex systems work.
* Ownership. Having a meaningful stake in the value the team is creating and capturing is important to me. This is both financial and psychological. Sometimes this means I take things too personally.
* Being part of a team I like and respect.
`

const interestsMarkdown = `
* [I read a lot](/books).
* I sporadically play Go. I love the hugely complex scenarios generated by simple rules, and the freedom that comes from knowing there's very little chance I'll make the perfect move.
* I take okay care of some plants on the patio.
* I played ultimate in college. I haven't played much lately, but I still love throwing things, and I'm getting into disc golf.
* The California coast is my favorite place.
`

export const Route = createFileRoute('/about/user-manual')({
  component: UserManual,
})

function UserManual() {
  return (
    <div className="max-w-prose mx-auto px-4 md:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          User manual for working with me
        </h1>
        <p className="text-gray-600 text-center">
          A guide to understanding my work style, preferences, and how we can collaborate effectively.
        </p>
      </header>
      
      <div className="space-y-8">
        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">How I think about the world</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
                strong(props) {
                  return <strong className="font-semibold text-gray-900">{props.children}</strong>
                },
                a(props) {
                  return <a className="text-blue-600 hover:underline" href={props.href} target="_blank" rel="noreferrer">{props.children}</a>
                },
              }}
            >
              {worldviewMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">My perfect workday includes</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {workdayMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">My preferred methods of communication</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
                strong(props) {
                  return <strong className="font-semibold text-gray-900">{props.children}</strong>
                },
              }}
            >
              {communicationMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Qualities I value in colleagues</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
                strong(props) {
                  return <strong className="font-semibold text-gray-900">{props.children}</strong>
                },
              }}
            >
              {qualitiesMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">What people misunderstand about me</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {misunderstandingMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">What stresses/frustrates me</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
                strong(props) {
                  return <strong className="font-semibold text-gray-900">{props.children}</strong>
                },
              }}
            >
              {stressMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">How others get the best out of me</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {bestOutMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">How I like to disagree</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {disagreeMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">How I ask for support</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {supportMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">What motivates me</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
              }}
            >
              {motivationMarkdown}
            </Markdown>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">What are my outside interests</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown
              components={{
                p(props) {
                  return <p className="mb-4 text-gray-700 leading-relaxed">{props.children}</p>
                },
                ul(props) {
                  return <ul className="list-disc mb-6 space-y-2">{props.children}</ul>
                },
                li(props) {
                  return <li className="ml-6 text-gray-700 leading-relaxed">{props.children}</li>
                },
                a(props) {
                  return <a className="text-blue-600 hover:underline" href={props.href}>{props.children}</a>
                },
              }}
            >
              {interestsMarkdown}
            </Markdown>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}