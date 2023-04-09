# PUSH NOTIFICATIONS - NOTIFICAÇÕES QUE DEVEM SER REALIZADAS

[X] - Notification to logged users that there is 7 days with out training.<br>
- [X] - OneSignal filter: User Tag "last_exercise_date" (timestamp) exists and time elapsed greater than 604800<br>
[X] - Notification of new added exercise.<br>
- [X] - OneSignal filter: User Tag "user_name" exists<br>
[X] - Motivation notification - Notify users of how many exercises they did and motivating then to continue.<br>
- [X] - OneSignal filter: User Tag "completed_exercise_count" exists and its more than 0<br>
[X] - Notification to not logged users to join make the first log in ou register.<br>
- [X] - OneSignal filter: User Tag "user_name" does not exists

# DEEP LINKING
[X] - At least 3 deep links.<br>
- [X] - SignUp - For users that did not logged or did not register. Notification for new users.<br>
- [X] - Home - For users to start the week training. Motivation notification.<br>
- [X] - exercises - To show a new exercise. Notification of new added exercise<br><br>

[X] - At least 1 deep link to a route with params.<br>
- [X] - exercises - To show a new exercise. Notification of new added exercise<br><br>

[X] - Deep links for authenticated and not authenticated routes.<br>
- [X] - Authenticated<br>
-- [X] - home - For users to start the week training. Motivation notification.<br>
-- [X] - exercises - To show a new exercise. Notification of new added exercise<br><br>
- [X] - Not authenticated<br>
-- [X] - signUp - For users that did not logged or did not register. Notification for new users.<br><br>

[X] - Not found treatment (404).<br>
-- [X] - If not found, goes to Sign In screen.<br><br>
