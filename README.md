# Bing Rewards points collector

## Description

A script to automate your [Bing Rewards](https://rewards.bing.com/) daily point collection using Puppeteer.
The script must be running **continuously** during the time it is expected to operate.

## Requirements

- Git *(only for cloning)*
- **Node & npm** *(or pnpm)*
- Chromium *(if running on arm based linux)* **add executable to PATH!**

## Usage:

1. Choose a nice directory and open the command line
2. `git clone https://github.com/Zsongli/bing-rewards bing-rewards`
3. `cd bing-rewards`
4. `npm i`
5. Rename or copy `.env.template` to `.env` and edit it to your likings
   - If you don't want Discord Integration when your token expires, leave `DISCORD_URL` empty
   - You can also set a permanent custom cron expression here
     - cron expression priority is [`argv` > `dotenv` > `fallback`]
6. `npm run build` (use superuser privileges if necessary)
7. `npm start` or `npm start -- "<cron expression>"` (**do not** use superuser privileges as Chromium does not support root)
8. Follow the instructions in the console



`pnpm` can also be used in `npm`'s place.  
Runs every day at noon by default, in case no argument is specified.
