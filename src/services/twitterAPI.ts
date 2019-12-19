import axios from "axios";

require('dotenv').config();

async function generateTwitterToken(): Promise<void> {
  const headers = {
    grant_type: "client_credentials",
    Authorization: process.env.TWITTER_GENERATE_TOKEN
  };
  return axios.post(
    "https://api.twitter.com/oauth2/token",
    {}, //empty body
    { headers }
  );
}

async function queryTwitterHashtag(
  search: string,
  numberOfTweets: number
): Promise<void> {
  const headers = {
    Authorization: process.env.TWITTER_QUERY_HASHTAG
  };
  return axios.get(
    "https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?q=%23" +
      search +
      " -filter:retweets&src=typed_query&count=" +
      numberOfTweets +
      "&tweet_mode=extended&lang=en",
    { headers }
  );
}

async function getTweetById(id: string): Promise<any> {
  const headers = {
    Authorization: process.env.TWITTER_GET_TWEET_BY_ID
  };
  return axios.get(
    `https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/statuses/show.json/id=${id}`,
    { headers }
  );
}

export { generateTwitterToken, queryTwitterHashtag, getTweetById };
