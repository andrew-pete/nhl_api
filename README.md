# nhl_api
# NHL_API
A straightforward API for the myriad of NHL resources

## Get Started

## Run
`npm run build`

## Available Endpoints
Below are the currently available endpoints for this API, with more in development!

### Season - /api/season/:year
To get the schedule for a season (which includes gameIds) you can send a request for to this endpoint.
- e.g. `/api/season/20182019`

_note_: append the baseUrl when requesting any resource. If you're hosting the server locally on localhost port 3000, your request would be to `localhost:3000/api/season/20182019`.

### Events - /api/events/:gameId
Use this endpoints to retrieve a JSON representation of the NHL's play-by-play data coming from their HTML Reports pages (e.g. http://www.nhl.com/scores/htmlreports/20182019/PL020001.HTM).

This JSON includes a list of events, and each event will have the following attributes (if valid):
- `event_no`: event number in the game
- `period`: (game) period corresponding to this event
- `strength`: player strength of event (EV, SH, PP for even strength, short-handed, power-play respectively)
- `time {elapsed, game}`: `time.elapsed` is the elapsed time in the period whereas `time.game` is the game/clock time
- `event`: event id
- `description`: provided event description
- `on_ice`: object `{home, away}` storing array of player objects for each player on the ice

Example: `/api/events/2018020001`

### Shifts - /api/shifts/:gameId
Get the JSON-representation of the NHL shifts table for any given game. The return type is an object with two attributes, `home` and `away`. Each is an array of player objects.

E.g.

javascript
```
{
    "home": [
        {
            "player": {
                "name": GIROUX_CLAUDE
                "number": 28
            },
            'shifts': [
                {
                    {
                        "shift_no":"1",
                        "period":"1",
                        "start-time":
                            {
                                "elapsed":"0:00",
                                "remaining":"20:00"
                            },
                            "end-time": {
                                "elapsed":"0:54",
                                "remaining":"19:06"
                            },
                            "duration":"00:54",
                            "event":""
                    }, ...
                }
            ]
        }, ...
    ],
    "away": [
        ...
    ]
}
```

## Contribute

Wow!! How thoughtful of you. I would love to have anyone contribute to this #OpenSource project. If you do, please fork the repo, set your upstream repo to https://github.com/andrew-pete/nhl_api and submit helpful Pull Requests. Contact me via Twitter @AndrewLPeterson with any questions or comments.