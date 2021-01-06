## What track are you submitting to?
We are submitting to the Inequalities Track.
## Inspiration and Theory
	
A recent innovation in the field of Computer Science and Mathematics is Differential Privacy. Differential Privacy is a set of theorems and mechanisms that enables a rigorous notion of privacy. This technique, in sort, adds random noise to obscure the data. We want to bring this technology to polls and surveys so that each user’s privacy can be preserved. 
###Motivating Example
Suppose our class keeps track of the number of people that have a failing grade (any grade less than 50). That alone seems innocuous - it is just the number of people and you don’t know who. Then, one day, Bob drops this class and coincidently the failing grade count drops, too. You probably can infer that Bob had a failing grade. 

If we randomize the count every time (by adding some noise), even if Bob left the class, we won’t know a difference (it would be quite random). Thus, we don’t know what Bob’s grade is.
### Mathematical Definition 

![img](https://lh5.googleusercontent.com/hRcbqhO55YNFvilqOEeLbNpM4KbmRk6atbqApNCqHmojF6z8DFeC5rKGsM_xTLQyPzEpp-Czcom4ZkZB7wgFVPMRazZAli5IQodfS7HmRi766VtDdfMAwkF4SW_awHG75siJ8B6k)

A small change in the dataset (one person leaving or joining) would NOT affect the result by much. Epsilon controls the maximum allowed difference between the dataset (a higher epsilon means more privacy loss). Delta is the probability of a (potentially) catastrophic privacy loss. 

## What Does It Do?
Our app enables users to create differentially private polls. Users can create polls with custom questions and share the poll using the generated link. Then, users can deactivate the poll and view the differentially private results on a dashboard. The dashboard would indicate the counts of each response and would note the confidence level of the counts.

### Instructions and Notes
1. Create an account.
2. Start a new poll.
3. Share link with people
4. View current polls - active and inactive.
5. Deactivate poll when finished
    * Due to the limitations of privacy, we cannot view the poll live.
    * Poll results are only available when poll is deactivated
6. View differentially private statistics in the dashboard.
    * Histogram of the counts of each poll
    * Intervals represent the confidence interval of the laplacian noise added to achieve differential privacy.

## How did we build it?
This app is developed using the MERN stack, which involves MongoDB, ExpressJS, ReactJS and NodeJS. Although all of us have some experience programming web apps, we are quite new to this stack.

We decided to split the development of the app into a frontend and the backend. For the frontend, we have an React-based app which sends requests on behalf of the user. 

For authentication, we use JWT tokens to authenticate users when they are creating, deactivating or view the results of the poll. 

We use a mixture of ExpressJS and MongoDB for the backend. We used a Google Cloud instance to serve our MongoDB in the cloud. The backend is responsible for registration of users and keeping track of users.

We also implemented a Differential Privacy mechanism using additive Laplacian noise when releasing poll results.

## Challenges we ran into
### Backend
On the backend, authentication was a difficult task. Most of us were familiar with session based authentication with PassportJS, which is natural to use for a servers-side app. However, since we were developing an secured API, we decided to switch to JWT auth. This was a relatively new concept for all of us. 

We were also new to using Mongoose, a Javascript MongoDB library. Many of the calls to the database involved asynchronous javascript, which can be tricky to get right. There were also several instances where our code failed to retrieve the right data from the database.

### Frontend
One challenge while working with canvas.js was understanding and incorporating their documentation into our code. For example, when we tried to display the confidence interval on the graph in the Poll Results page, we went through a series of trials and errors trying to revise the code for a box and whisker chart to work for our doughnut chart.

## Accomplishments that we're proud of?
This project was our first to employ authorization. We were proud to be able to quickly learn and integrate axios.get requests, axios.post requests, base instances, etc. 

We also were proud to apply some of the theoretical CS research we conducted as undergraduate researchers.

## What we learned?
This project was our first to employ axios with react. We were proud to be able to quickly learn and integrate axios.get requests, axios.post requests, base instances, etc. 


## What's next?

For future work, we would like to expand the types of questions users can ask and allow custom allocation of privacy.

