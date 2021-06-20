import cron from 'node-cron';
import fetch from 'node-fetch';

export let redditMemeArray: any = [];

const SUBLIST = ['meme', 'trippinthroughtime'];

async function fetchReddit(): Promise<void> {
  const body = await (await fetch(`https://reddit.com/r/${SUBLIST.random()}/top/.json`)).json();
  redditMemeArray = body.data.children;
}

export function initRedditFetch(runCron: boolean): void {
  fetchReddit(); // await ignored, cause I don't need to wait for the fetch to fullfill immediately.
  if (runCron) {
    cron.schedule('*/15 * * * *', async () => {
      console.log('[S] ---------------------');
      console.log('[S] Running Cron Job - REDDIT');
      await fetchReddit();
    });
  }
}
