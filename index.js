const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Available timings
let availableTimings = {
  "21/01/2023": [1, 2, 3, 4, 5, 6],
  "22/01/2023": [3, 4, 5, 6],
  "23/01/2023": [1, 2, 5, 6],
};

//schedule record
let schedule = {};

//view page for available time
app.get("/", (req, res) => {
  res.send(availableTimings);
  console.log(availableTimings);
});

// Update available timings endpoint
app.put("/:user/update-timings", (req, res) => {
  const desiredTiming = req.body.timing;
  const prevDate = req.body.prevdate;
  const desiredDate = req.body.date;
  let user = req.params.user;

  if (schedule[user + prevDate] != null) {
    availableTimings[prevDate].push(parseInt(schedule[user + prevDate]));
    availableTimings[desiredDate] = availableTimings[desiredDate].filter(
      (value) => {
        return value != desiredTiming;
      }
    );
    delete schedule[user + prevDate];
    schedule[user + desiredDate] = desiredTiming;

    res.send("Timings updated");
  } else {
    res.send("you dont have any scheduled meeting");
  }
  console.log(schedule);
});

// Schedule meeting endpoint
app.post("/:user/schedule-meeting", (req, res) => {
  const desiredTiming = req.body.timing;
  const desiredDate = req.body.date;
  let user = req.params.user;

  console.log(availableTimings[desiredDate].includes(parseInt(desiredTiming)));

  if (
    availableTimings[desiredDate] != null &&
    availableTimings[desiredDate].includes(parseInt(desiredTiming))
  ) {
    // Schedule meeting
    availableTimings[desiredDate] = availableTimings[desiredDate].filter(
      (value) => {
        return value != desiredTiming;
      }
    );

    schedule[user + desiredDate] = desiredTiming;

    res.send(`Meeting scheduled at ${desiredTiming}`);
  } else {
    res.status(400).send(`${desiredTiming} ${desiredDate} is not available`);
  }
  console.log(schedule);
});

//cancelling the schedule
app.delete("/:user", (req, res) => {
  let user = req.params.user;
  const desiredDate = req.body.date;

  if (schedule[user + desiredDate] != null) {
    availableTimings[desiredDate].push(parseInt(schedule[user + desiredDate]));
    delete schedule[user + desiredDate];
  }
  res.send("Meeting canceled");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
