# Bing Rewards points collector
## Description
A script to automate your [Bing Rewards](https://rewards.bing.com/) daily point collection using Puppeteer.
The script must be running **continuously** during the time it is expected to operate.

## Requirements
 - Git *(only for cloning)*
 - **Node & npm** *(or pnpm)*

## Usage:
 1. choose a nice directory and open the command line
 2. `git clone https://github.com/Zsongli/bing-rewards bing-rewards`
 3. `cd bing-rewards`
 4. `npm i`
 5. `npm start` or `npm start -- "<cron expression>"`
 6. follow the instructions in the console

`pnpm` can also be used in `npm`'s place.  
Runs every day at noon by default, in case no argument is specified.
