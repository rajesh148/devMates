## authRouter

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET /profiles/view
-PATCH /profile/edit
-PATCH /profile/password

## connectionRequestRouter

-POST /request/send/:status/:toUserId
-POST /request/review/:status/:requestId

-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

## userRouter

-GET /user/connections
-GET /user/requests
-GET /user/feed -gets you the profiles of other users on platform

STATUS: ignored, interested,accepted, rejected
