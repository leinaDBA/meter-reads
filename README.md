# meter-reads
## Pre-requisites
 - Node 14
 - npm ^6

##Scripts
###Install
```shell
npm i
```

###Test
```shell
npm test
```

##Answers
I approached both problems by reading through the design guide carefully.
I re-wrote the design guide into bullet points that made sense to me.
I re-organized the bullets into an order that made sense for the different algorithm's
Got to work!
###QuestionOne
This was a lot easier than the second question, I spent less than an hour (I wasn't counting).
I created validation by creating type guards and other checker functions.
After validation, I mapped the inputs to an array with the increase between 'current month' and 'previous month'.
After I knew what each increase was I reduce the array looking which increase was bigger between each iteration.
Finally I returned the object with the largest increase.
I needed to assume I didn't need to account for missing months between each reading. 

###QuestionTwo
I must admit here that I didn't know what interpolate means in this context.
If I had the chance I would have asked for clarity because it is pretty significant when solving.
I spent a bit more time on this getting the bugs out, maybe an hour or a little more?
But I'm really happy to say that this came together very nicely and didn't need much refactoring at all.
On the face of this answer there is a lot going on, but actually it's mostly just variable's getting assigned.
Most of the variables are for readability.
After validation, I figure out the different amount of days and months between each read.
Calculate the average spend per day based on `usage between each read / number of days`.
For each month between the reads I then figure out the amount of days till the end of the current month OR the amount of days in the month (if there is more than one month between each read).
Calculating is then pretty easy: `(amount of days * daily usage) + cumulative`
Finally, I did not run this on the last month of the readings.

###Testing
Testing was pretty static for this as there are only right and wrong answers, I could have used snapshots.
