const cron = require('node-cron');

import { updateFlightStatuses } from './src/controllers/rewardController';

async function dailyUpdateFlightStatuses() {
  try {
    await updateFlightStatuses()
    console.log("Flight");
    console.log( 'Flight status updated');
  } catch (error) {
    console.log('Failed to update flight status: ' + error);
  }
}

cron.schedule('0 9 * * *', () => {
  dailyUpdateFlightStatuses();
});