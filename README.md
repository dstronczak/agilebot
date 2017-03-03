# Agile Bot

Agile Bot is a simple slack bot written for pure fun. It will react to some keywords in user messages responding with "agile quotes".

## Getting Started

### Configuration

In `bot.js` there are 3 config parameters that should be set appriatelly:

* `token` - has to contain a valid API Key here for the slack emvironment you would like to use
* `dbPath` - path of the SQLite database used by the bot (is set to some sample out of the bot db by default)
* `name` - the username you want to give to the bot within your organisation ("agilebot" by default)

### Installing

In the root directory simply run `npm install`. This will install all apropriate dependencies.

## Running the bot

To run the bot you shold run the following commands:
`npm run bin/bots.js`

For a production usage I'd recommends using some kind of process manager like http://pm2.keymetrics.io/.

## What can the bot do
### Available commands

 * `AB|help` - Print help message
 * `AB|funnymovie` - Get a funny movie
 * `AB|addquote <keyword\> <quote\>` - Add new keyword reaction to database
 * `AB|randomuser` - Pick a random user from the current channel.

 ### Reacting to keywords

 There is some change the bot will react to a keyword when it's present in a message on a channel where the bot is present. By default, the bot knows these keywords:

Keyword | Quote
------- | -------
 "team" | """Because the needs of the one… outweigh the needs of the many."" – Star Trek III: The Search for Spock, Captain Kirk."
"think" | """What we think, we become."" - Buddha"
"plan" | "Plans are of little importance, but planning is essential – Winston Churchill. "
"code" | "“Indeed, the ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code. ...[Therefore,] making it easy to read makes it easier to write.” ― Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship"
"name" | "“A long descriptive name is better than a short enigmatic name. A long descriptive name is better than a long descriptive comment.” ― Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship"
"devops" | "“Agile and DevOps are for harnessing integration, interaction, and innovation.” ― Pearl Zhu, Digital Agility: The Rocky Road from Doing Agile to Being Agile"
"agile" | "“Innovative ideas aren't generated in structured, authoritarian environments but in an adaptive culture based on the principles of self-organization and self-discipline.” ― Jim Highsmith, Agile Project Management: Creating Innovative Products"
"fear" | "Luck is not a factor. Hope is not a strategy. Fear is not an option. - James Cameron. "
"tommorow" | "“Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.” – Albert Einstein"
"perfect" | "“Perfection is not attainable, but if we chase perfection we can catch excellence.” -Vince Lombardi"
"others" | "“Service to others is the rent you pay for your room here on earth.” – Muhammad Ali"
"defeat" | "“We may encounter many defeats but we must not be defeated.” – Maya Angelou"
"change" | "“Intelligence is the ability to adapt to change.” – Stephen Hawking"
"give up" | " “Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.” – Thomas A. Edison"
"success" | """Success is not final, failure is not fatal: it is the courage to continue that counts"" - W. Churchill"
"change" | """To improve is to change; to be perfect is to change often"" - W. Churchill"
"strategy" | """However beautiful the strategy, you should occasionally look at the results"" - W. Churchill"
"failure" | """Courage is going from failure to failure without losing enthusiasm"" - W. Churchill"
"simple" | """Simplicity is the ultimate sophistication"" - Da Vinci"
"can" | """Whether you think that you can, or that you can’t, you are usually right"" - Henry Ford"
"idea" | """The value of an idea lies in the using of it"" - Thomas Edison"
"goal" | """People with goals succeed because they know where they’re going"" - E. Nightingale"
"algorithm" | "“Algorithmic complexity for structured programmers: All algorithms are O(f(n)), where f is someone else’s responsibility.” – Peter Cooper"
"tool" | "“I’ve known people who have not mastered their tools who are good programmers, but not a tool master who remained a mediocre programmer.” – Kent Beck"
"recursion" | "“There are two types of people in this world: those who understand recursion and those who don’t understand that there are two types of people in this world.”"
"software" | "“Daddy, how is software made?” “Well, when a programmer loves an idea very much they stay up all night and then push to github the next day.” – Sam Kottler "
"agile" | "Individuals and interactions over processes and tools, Working software over comprehensive documentation, Customer collaboration over contract negotiation, Responding to change over following a plan"
"problem" | "“Software developers like to solve problems. If there are no problems handily available, they will create their own problems.”"
"dirty" | "“The problem with quick and dirty, is that the dirty remains long after the quick has been forgotten” – Steve C. McConnell"
"joke" | "“A programmer’s wife tells him: go to store. pick up a loaf of bread. If they have eggs, get a dozen. The programmer returns with 12 loaves.”"
"testing" | "“Bad programmers have all the answers. Good testers have all the questions.” – Gil Zilberfeld"
"tester" | "“Our job is to tell you your baby is ugly!” – Software Testers"
"deadline" | "“The bitterness of poor quality remains long after the sweetness of meeting the schedule has been forgotten.” – Anonymous"
"comment" | "“Don’t document bad code — rewrite it.” – Kernighan and Plauger"
"joke" | "“3 Errors walk into a bar. The barman says, “normally I’d Throw you all out, but tonight I’ll make an Exception.” – @iamdevloper"
"planning" | "“Weeks of programming can save you hours of planning.” - Anonymous"
"joke" | "“Knock, knock.” “Who’s there?” very long pause…. “Java.”"
"team" | "“Programming is not a zero-sum game. Teaching something to a fellow programmer doesn’t take it away from you.” – John Carmack"
"dilbert" | "https://image-store.slidesharecdn.com/128c6f87-a881-41cb-ad46-ace12bd27e3f-large.png"
"dilbert" | "http://1.bp.blogspot.com/-nllU9BepxbA/T-bWPRl7bsI/AAAAAAAABAU/tPXQD2rlY1c/s1600/1791.strip.gif"
"dilbert" | "http://brucelynnblog.files.wordpress.com/2014/01/dilbert-drunken-monkeys.jpg"
"mistake" | """Anyone who has never made a mistake has never tried anything new."" - Albert Einstein"
"strategy" | """However beautiful the strategy, you should occasionally look at the results."" - Winston Churchill"
"idea" | """The value of an idea lies in the using of it."" - Thomas Edison
"kanban" | "1. Visualize the workflow   2. Limit WIP 3. Manage Flow 4. Make Process Policies Explicit 5. Improve Collaboratively (using models & the scientific method)"
"lunch" |"http://cdn.quotesgram.com/img/58/61/1299993240-keep-calm-and-have-lunch-601127.jpg"
"scrum" | "“Any Scrum without working product at the end of a sprint is a failed Scrum.” - Jeff Sutherland"
"lean" | "“The biggest cause of failure in software-intensive systems is not technical failure; it’s building the wrong thing.”  ― Mary Poppendieck, Leading Lean Software Development: Results Are not the Point"
"scrum master" | "http://www.agilelearninglabs.com/wp-content/uploads/2012/02/what-does-a-scrum-master-do1.jpg"
"efficiency" | "There is nothing so useless as doing efficiently that which should not be done at all.  - Peter F. Drucker"

# Built With

* [node.js](https://nodejs.org/en/) - Javascript runtime.
* [slackbots](https://www.npmjs.com/package/slackbots) - A library for easy Slack API operations.
* [sqlliste3](https://www.sqlite.org/index.html) - Simple database engine.

## Authors

* **Dawid Stronczak** - *Initial work* - [dstronczak](https://github.com/dstronczak)

## License

This project is licensed under the MIT License.